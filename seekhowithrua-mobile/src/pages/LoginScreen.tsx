import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const API_URL = 'https://api.seekhowithrua.com/api';

type Step = 'input' | 'otp' | 'name';
type Method = 'email' | 'mobile';

export default function LoginScreen() {
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<Step>('input');
  const [method, setMethod] = useState<Method>('mobile');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpInputs = useRef<(TextInput | null)[]>([]);

  // Send OTP
  const handleSendOtp = async () => {
    if (!contact.trim()) {
      Alert.alert('Error', `Please enter your ${method === 'email' ? 'email' : 'mobile number'}`);
      return;
    }

    // Validation
    if (method === 'email' && !contact.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (method === 'mobile' && contact.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [method]: contact,
          type: method
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('OTP Sent', `Check your ${method === 'email' ? 'email' : 'SMS'} for the verification code`);
        setStep('otp');
        setCountdown(60);
        startCountdown();
      } else {
        Alert.alert('Error', data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      // For demo: allow proceeding with mock OTP
      Alert.alert('Demo Mode', `OTP would be sent to ${contact}. Enter 123456 to continue`);
      setStep('otp');
      setCountdown(60);
      startCountdown();
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [method]: contact,
          otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.is_new_user) {
          setStep('name');
        } else {
          // Existing user - login directly
          await setAuth(data.token, data.user);
        }
      } else {
        Alert.alert('Error', data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      // Demo: proceed with mock success
      if (otp === '123456') {
        setStep('name');
      } else {
        Alert.alert('Error', 'Invalid OTP. Try 123456 for demo');
      }
    } finally {
      setLoading(false);
    }
  };

  // Complete registration
  const handleCompleteRegistration = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [method]: contact,
          name,
          otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await setAuth(data.token, data.user);
      } else {
        Alert.alert('Error', data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Demo: mock success - match User interface
      await setAuth('mock_token_' + Date.now(), {
        id: Date.now(),
        username: name.toLowerCase().replace(/\s+/g, '_'),
        email: method === 'email' ? contact : `${contact}@mobile.user`,
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || '',
      } as any);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = otp.split('');
    newOtp[index] = text;
    setOtp(newOtp.join(''));

    // Auto-focus next input
    if (text && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  // Resend OTP
  const handleResend = () => {
    setOtp('');
    handleSendOtp();
  };

  // Render steps
  const renderInputStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Login or Register</Text>
      <Text style={styles.stepSubtitle}>Choose how you want to continue</Text>

      {/* Method Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, method === 'mobile' && styles.toggleActive]}
          onPress={() => setMethod('mobile')}
        >
          <Text style={[styles.toggleText, method === 'mobile' && styles.toggleTextActive]}>
            📱 Mobile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, method === 'email' && styles.toggleActive]}
          onPress={() => setMethod('email')}
        >
          <Text style={[styles.toggleText, method === 'email' && styles.toggleTextActive]}>
            📧 Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder={method === 'email' ? 'Enter your email' : 'Enter mobile number'}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
        autoCapitalize="none"
        value={contact}
        onChangeText={setContact}
        editable={!loading}
      />

      {/* Send OTP Button */}
      <TouchableOpacity
        style={[styles.actionBtn, loading && styles.actionBtnDisabled]}
        onPress={handleSendOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.actionBtnText}>Send OTP</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.hint}>Demo OTP: 123456</Text>
    </View>
  );

  const renderOtpStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enter OTP</Text>
      <Text style={styles.stepSubtitle}>
        Code sent to {method === 'email' ? contact : `+91${contact}`}
      </Text>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => { otpInputs.current[index] = ref; }}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index] || ''}
            onChangeText={(text) => handleOtpChange(text, index)}
            editable={!loading}
            selectTextOnFocus
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={[styles.actionBtn, loading && styles.actionBtnDisabled]}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.actionBtnText}>Verify & Continue</Text>
        )}
      </TouchableOpacity>

      {/* Resend */}
      {countdown > 0 ? (
        <Text style={styles.resendText}>Resend in {countdown}s</Text>
      ) : (
        <TouchableOpacity onPress={handleResend} disabled={loading}>
          <Text style={styles.resendLink}>Resend OTP</Text>
        </TouchableOpacity>
      )}

      {/* Back */}
      <TouchableOpacity onPress={() => setStep('input')} disabled={loading}>
        <Text style={styles.backLink}>← Change {method === 'email' ? 'email' : 'number'}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNameStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Almost Done!</Text>
      <Text style={styles.stepSubtitle}>What should we call you?</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor={COLORS.textMuted}
        value={name}
        onChangeText={setName}
        editable={!loading}
        autoFocus
      />

      <TouchableOpacity
        style={[styles.actionBtn, loading && styles.actionBtnDisabled]}
        onPress={handleCompleteRegistration}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.actionBtnText}>Get Started 🚀</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🎓</Text>
          <Text style={styles.title}>SeekhoWithRua</Text>
          <Text style={styles.subtitle}>Learn • Speak • Earn</Text>
        </View>

        {/* Step Content */}
        {step === 'input' && renderInputStep()}
        {step === 'otp' && renderOtpStep()}
        {step === 'name' && renderNameStep()}

        {/* Footer */}
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoEmoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  stepContainer: {
    width: '100%',
  },
  stepTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    textAlign: 'center',
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
  },
  hint: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.md,
  },
  resendText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
  },
  resendLink: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  backLink: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
  },
  footerText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xxl,
  },
});
