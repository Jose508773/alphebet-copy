import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Platform, 
  Animated
} from 'react-native';
import { COLORS } from '../constants/StyleGuide';
import { useAccessibility } from '../constants/AccessibilityContext';
import { LETTER_EMOJI } from '../constants/StyleGuide';
import { speechUtils, LETTER_DATA, speechSynthesis } from '../utils/SpeechUtils';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

// Generate multiple choice options
const generateOptions = (correctLetter: string): string[] => {
  const options = [correctLetter];
  const allLetters = [...LETTERS];
  const correctIndex = allLetters.indexOf(correctLetter);
  
  // Remove the correct letter from the pool
  allLetters.splice(correctIndex, 1);
  
  // Add 3 random wrong answers
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * allLetters.length);
    options.push(allLetters[randomIndex]);
    allLetters.splice(randomIndex, 1);
  }
  
  // Shuffle the options
  return options.sort(() => Math.random() - 0.5);
};

export const PracticeMode: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  const [currentLetter, setCurrentLetter] = useState(LETTERS[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const { highContrast } = useAccessibility();

  // Initialize or reset the quiz
  const generateNewQuestion = () => {
    const randomLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    setCurrentLetter(randomLetter);
    setOptions(generateOptions(randomLetter));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  // Start the quiz when component mounts
  useEffect(() => {
    generateNewQuestion();
  }, []);

  // Ask the question with speech
  const askQuestion = () => {
    const letterData = LETTER_DATA[currentLetter];
    if (letterData) {
      const question = `What letter makes the "${letterData.phonetic}" sound?`;
      speechSynthesis.speak(question, {
        rate: 0.6,
        pitch: 1.1,
        volume: 1.0,
        language: 'en-US'
      });
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (selectedLetter: string) => {
    setSelectedAnswer(selectedLetter);
    const correct = selectedLetter === currentLetter;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
      speechUtils.speakSuccess();
    } else {
      // Enhanced wrong answer feedback
      setTimeout(() => {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
          // Clear wrong answer announcement
          window.speechSynthesis.speak(new SpeechSynthesisUtterance("That's incorrect. Try again!"));
          
          // After a pause, give the correct answer
          setTimeout(() => {
            const correctAnswerText = `The correct answer is ${currentLetter}. ${currentLetter} makes the ${LETTER_DATA[currentLetter]?.phonetic} sound.`;
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(correctAnswerText));
          }, 1500);
        }
      }, 500);
      
      speechUtils.speakEncouragement();
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    generateNewQuestion();
    setTimeout(() => {
      askQuestion();
    }, 500);
  };

  // Ask question when current letter changes
  useEffect(() => {
    if (currentLetter && !selectedAnswer) {
      setTimeout(() => {
        askQuestion();
      }, 1000);
    }
  }, [currentLetter]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz Mode</Text>
        <Pressable
          style={styles.homeButton}
          onPress={onHome}
          accessibilityLabel="Go back to home"
        >
          <Text style={styles.homeButtonText}>🏠</Text>
        </Pressable>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}/{totalQuestions}</Text>
      </View>

      <View style={styles.questionArea}>
        <Text style={styles.questionText}>
          What letter makes the &quot;{LETTER_DATA[currentLetter]?.phonetic}&quot; sound?
        </Text>
        
        <Pressable
          style={styles.replayButton}
          onPress={askQuestion}
          accessibilityLabel="Replay question"
        >
          <Text style={styles.replayButtonText}>🔊 Replay Question</Text>
        </Pressable>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Pressable
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && isCorrect && styles.correctAnswer,
              selectedAnswer === option && !isCorrect && styles.wrongAnswer,
              selectedAnswer && option === currentLetter && styles.correctAnswer,
            ]}
            onPress={() => !selectedAnswer && handleAnswerSelect(option)}
            disabled={selectedAnswer !== null}
            accessibilityLabel={`Option ${index + 1}: ${option}`}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === option && isCorrect && styles.correctAnswerText,
              selectedAnswer === option && !isCorrect && styles.wrongAnswerText,
              selectedAnswer && option === currentLetter && styles.correctAnswerText,
            ]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text style={[
            styles.feedbackText,
            isCorrect ? styles.correctFeedback : styles.wrongFeedback
          ]}>
            {isCorrect ? '✅ Correct! Well done!' : '❌ That\'s incorrect!'}
          </Text>
          <Text style={styles.explanationText}>
            {isCorrect 
              ? `Great job! ${currentLetter} makes the "${LETTER_DATA[currentLetter]?.phonetic}" sound.`
              : `The correct answer is ${currentLetter}. Remember: ${currentLetter} makes the "${LETTER_DATA[currentLetter]?.phonetic}" sound.`
            }
          </Text>
          <Pressable
            style={styles.nextButton}
            onPress={handleNextQuestion}
            accessibilityLabel="Next question"
          >
            <Text style={styles.nextButtonText}>Next Question →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastelMint,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  homeButton: {
    padding: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
  },
  homeButtonText: {
    fontSize: 24,
    color: COLORS.white,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.brightPurple,
  },
  questionArea: {
    alignItems: 'center',
    marginBottom: 30,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  replayButton: {
    backgroundColor: COLORS.brightBlue,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  replayButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 15,
  },
  optionButton: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  correctAnswer: {
    backgroundColor: COLORS.brightGreen,
  },
  correctAnswerText: {
    color: COLORS.white,
  },
  wrongAnswer: {
    backgroundColor: COLORS.brightRed,
  },
  wrongAnswerText: {
    color: COLORS.white,
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: COLORS.pastelLavender,
    borderRadius: 15,
    marginHorizontal: 20,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  correctFeedback: {
    color: COLORS.brightGreen,
  },
  wrongFeedback: {
    color: COLORS.brightRed,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  explanationText: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});