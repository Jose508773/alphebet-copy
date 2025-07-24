import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, RAINBOW, LETTER_EMOJI } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface Card {
  id: number;
  letter: string;
  emoji: string;
  color: string;
  animX: Animated.Value;
  animY: Animated.Value;
  animZ: Animated.Value;
  animRotation: Animated.Value;
  animScale: Animated.Value;
}

interface CardStackShuffleProps {
  isVisible: boolean;
  onShuffleComplete?: () => void;
  shuffleType?: 'riffle' | 'overhand' | 'fan' | 'cascade';
  cardCount?: number;
  duration?: number;
}

export default function CardStackShuffle({ 
  isVisible, 
  onShuffleComplete, 
  shuffleType = 'riffle',
  cardCount = 12,
  duration = 3000 
}: CardStackShuffleProps) {
  const cards = useRef<Card[]>([]);
  const masterOpacityAnim = useRef(new Animated.Value(0)).current;
  const stackOffsetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create cards
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    cards.current = Array.from({ length: cardCount }, (_, i) => {
      const letter = letters[i % letters.length];
      return {
        id: i,
        letter,
        emoji: LETTER_EMOJI[letter] || '🔤',
        color: RAINBOW[i % RAINBOW.length],
        animX: new Animated.Value(0),
        animY: new Animated.Value(0),
        animZ: new Animated.Value(i * 2), // Stack depth
        animRotation: new Animated.Value(0),
        animScale: new Animated.Value(1),
      };
    });
  }, [cardCount]);

  useEffect(() => {
    if (isVisible) {
      // Reset all animations
      cards.current.forEach((card, index) => {
        card.animX.setValue(0);
        card.animY.setValue(0);
        card.animZ.setValue(index * 2);
        card.animRotation.setValue(0);
        card.animScale.setValue(1);
      });
      masterOpacityAnim.setValue(0);
      stackOffsetAnim.setValue(0);

      // Start fade in
      Animated.timing(masterOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      let shuffleAnimation: Animated.CompositeAnimation;

      switch (shuffleType) {
        case 'riffle':
          shuffleAnimation = createRiffleAnimation();
          break;
        case 'overhand':
          shuffleAnimation = createOverhandAnimation();
          break;
        case 'fan':
          shuffleAnimation = createFanAnimation();
          break;
        case 'cascade':
          shuffleAnimation = createCascadeAnimation();
          break;
        default:
          shuffleAnimation = createRiffleAnimation();
      }

      shuffleAnimation.start(() => {
        // Fade out and complete
        setTimeout(() => {
          Animated.timing(masterOpacityAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            onShuffleComplete?.();
          });
        }, 500);
      });
    }
  }, [isVisible, shuffleType]);

  const createRiffleAnimation = () => {
    return Animated.sequence([
      // Split deck into two halves
      Animated.parallel([
        ...cards.current.slice(0, Math.floor(cardCount / 2)).map((card, index) =>
          Animated.parallel([
            Animated.timing(card.animX, {
              toValue: -60,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            Animated.timing(card.animRotation, {
              toValue: -15 + index * 2,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
          ])
        ),
        ...cards.current.slice(Math.floor(cardCount / 2)).map((card, index) =>
          Animated.parallel([
            Animated.timing(card.animX, {
              toValue: 60,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            Animated.timing(card.animRotation, {
              toValue: 15 - index * 2,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
      
      // Riffle shuffle
      Animated.parallel([
        ...cards.current.map((card, index) => {
          const isLeft = index < Math.floor(cardCount / 2);
          const delay = (index % Math.floor(cardCount / 2)) * 80;
          
          return Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(card.animX, {
                toValue: 0,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(card.animY, {
                toValue: Math.sin(index * 0.5) * 20,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(card.animRotation, {
                toValue: 0,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
            ]),
          ]);
        }),
      ]),

      // Final stack
      Animated.parallel([
        ...cards.current.map((card, index) =>
          Animated.parallel([
            Animated.timing(card.animY, {
              toValue: 0,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            Animated.timing(card.animZ, {
              toValue: index * 1.5,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
    ]);
  };

  const createOverhandAnimation = () => {
    return Animated.sequence([
      // Lift small packets
      ...Array.from({ length: 4 }, (_, packet) => 
        Animated.sequence([
          Animated.parallel([
            ...cards.current.slice(packet * 3, (packet + 1) * 3).map((card) =>
              Animated.parallel([
                Animated.timing(card.animY, {
                  toValue: -40 - packet * 10,
                  duration: duration * 0.1,
                  useNativeDriver: true,
                }),
                Animated.timing(card.animX, {
                  toValue: packet * 15,
                  duration: duration * 0.1,
                  useNativeDriver: true,
                }),
                Animated.timing(card.animRotation, {
                  toValue: packet * 5,
                  duration: duration * 0.1,
                  useNativeDriver: true,
                }),
              ])
            ),
          ]),
          
          // Drop to new position
          Animated.parallel([
            ...cards.current.slice(packet * 3, (packet + 1) * 3).map((card, index) =>
              Animated.parallel([
                Animated.timing(card.animY, {
                  toValue: 0,
                  duration: duration * 0.15,
                  useNativeDriver: true,
                }),
                Animated.timing(card.animX, {
                  toValue: 0,
                  duration: duration * 0.15,
                  useNativeDriver: true,
                }),
                Animated.timing(card.animRotation, {
                  toValue: 0,
                  duration: duration * 0.15,
                  useNativeDriver: true,
                }),
                Animated.timing(card.animZ, {
                  toValue: (cardCount - packet * 3 - index - 1) * 2,
                  duration: duration * 0.15,
                  useNativeDriver: true,
                }),
              ])
            ),
          ]),
        ])
      ),
    ]);
  };

  const createFanAnimation = () => {
    return Animated.sequence([
      // Fan out
      Animated.parallel([
        ...cards.current.map((card, index) => {
          const angle = (index / (cardCount - 1)) * 180 - 90; // -90 to +90 degrees
          const radius = 80;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          return Animated.parallel([
            Animated.timing(card.animX, {
              toValue: x,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
            Animated.timing(card.animY, {
              toValue: y,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
            Animated.timing(card.animRotation, {
              toValue: angle * 0.5,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
            Animated.timing(card.animScale, {
              toValue: 0.9,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
          ]);
        }),
      ]),

      // Hold fan
      Animated.delay(duration * 0.2),

      // Collapse back
      Animated.parallel([
        ...cards.current.map((card, index) =>
          Animated.parallel([
            Animated.timing(card.animX, {
              toValue: 0,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
            Animated.timing(card.animY, {
              toValue: 0,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
            Animated.timing(card.animRotation, {
              toValue: 0,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
            Animated.timing(card.animScale, {
              toValue: 1,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
    ]);
  };

  const createCascadeAnimation = () => {
    return Animated.sequence([
      // Cascade fall
      Animated.stagger(100, [
        ...cards.current.map((card, index) =>
          Animated.sequence([
            Animated.parallel([
              Animated.timing(card.animX, {
                toValue: (index % 2 === 0 ? 1 : -1) * 100,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(card.animY, {
                toValue: 150 + index * 10,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(card.animRotation, {
                toValue: (index % 2 === 0 ? 1 : -1) * 180,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
            ]),
            
            // Bounce back up
            Animated.parallel([
              Animated.timing(card.animX, {
                toValue: 0,
                duration: duration * 0.2,
                useNativeDriver: true,
              }),
              Animated.timing(card.animY, {
                toValue: 0,
                duration: duration * 0.2,
                useNativeDriver: true,
              }),
              Animated.timing(card.animRotation, {
                toValue: 0,
                duration: duration * 0.2,
                useNativeDriver: true,
              }),
            ]),
          ])
        ),
      ]),
    ]);
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.shuffleContainer,
          {
            opacity: masterOpacityAnim,
          },
        ]}
      >
        {/* Shuffle Effect Area */}
        <View style={styles.cardArea}>
          {cards.current.map((card) => (
            <Animated.View
              key={card.id}
              style={[
                styles.card,
                {
                  backgroundColor: card.color,
                  zIndex: cardCount - card.id,
                  transform: [
                    { perspective: 1000 },
                    {
                      translateX: card.animX,
                    },
                    {
                      translateY: card.animY,
                    },
                    {
                      translateZ: card.animZ,
                    },
                    {
                      rotateZ: card.animRotation.interpolate({
                        inputRange: [-180, 180],
                        outputRange: ['-180deg', '180deg'],
                      }),
                    },
                    { scale: card.animScale },
                  ],
                },
              ]}
            >
              <Text style={styles.cardEmoji}>{card.emoji}</Text>
              <Text style={styles.cardLetter}>{card.letter}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Shuffle Type Indicator */}
        <View style={styles.indicatorContainer}>
          <Text style={styles.shuffleTypeText}>
            {shuffleType.charAt(0).toUpperCase() + shuffleType.slice(1)} Shuffle
          </Text>
        </View>
      </Animated.View>

      {/* Background Overlay */}
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: masterOpacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7],
            }),
          },
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1600,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.black,
    zIndex: -1,
  },
  shuffleContainer: {
    width: width * 0.8,
    height: height * 0.7,
    maxWidth: 400,
    maxHeight: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardArea: {
    width: 200,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: 80,
    height: 110,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  cardLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    fontFamily: FONTS.heading,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shuffleTypeText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
  },
}); 