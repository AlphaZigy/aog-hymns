import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  BackHandler,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useSettings } from '../context/SettingsContext';
import { getThemedColors } from '../utils/theme';
import fonts from '../utils/constants/fonts';

const { width } = Dimensions.get('window');

interface ExitModalProps {
  visible: boolean;
  onCancel: () => void;
  onExit: () => void;
}

const ExitModal: React.FC<ExitModalProps> = ({ visible, onCancel, onExit }) => {
  const { settings } = useSettings();
  const colors = getThemedColors(settings.isDarkMode);

  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          {/* Lottie Icon */}
          <View style={styles.iconContainer}>
            <LottieView
              source={require('../assets/alert.json')}
              autoPlay
              loop={false}
              style={styles.lottieIcon}
              speed={0.8}
            />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            Exit AOG Hymns?
          </Text>

          {/* Message */}
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            Are you sure you want to exit the application? You can always come back.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={onCancel}
              activeOpacity={0.8}
              accessibilityLabel="Cancel exit"
              accessibilityRole="button"
              accessibilityHint="Stay in the app"
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.exitButton, { backgroundColor: '#ff4444' }]}
              onPress={handleExit}
              activeOpacity={0.8}
              accessibilityLabel="Exit app"
              accessibilityRole="button"
              accessibilityHint="Close the AOG Hymns application"
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 350,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  iconContainer: {
    marginBottom: 16,
  },
  lottieIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.Bold || 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  message: {
    fontSize: 16,
    fontFamily: fonts.Regular || 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  exitButton: {
    elevation: 2,
    shadowColor: '#ff4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.Bold || 'Poppins-Bold',
    fontWeight: '600',
  },
});

export default ExitModal;
