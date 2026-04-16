// mobile/src/navigation/MainTabs.tsx
// SIMPLIFIED: Only 2 features - Courses + VCR/AI

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONTS, SPACING } from "../constants/theme";

// Pages - Only 2 main features
import Courses from "../pages/Courses";
import VCRoom from "../pages/VCRoom";
import TalkWithRua from "../pages/TalkWithRua";
import { useAuthStore } from "../store/authStore";

// ─── Tab param list ────────────────────────────────────────────────────────
export type MainTabParamList = {
  Courses: undefined;      // All courses from website
  Live: undefined;         // VCR + AI combined
};

export type LiveStackParamList = {
  LiveMenu: undefined;
  VCRoom: undefined;
  TalkWithRua: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const LiveStack = createNativeStackNavigator<LiveStackParamList>();

// ─── Tab Icon Component ────────────────────────────────────────────────────
function TabIcon({ label, emoji, focused }: { label: string; emoji: string; focused: boolean }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

// ─── Live Menu Screen ──────────────────────────────────────────────────────
// VCR + AI combined menu
function LiveMenuScreen({ navigation }: any) {
  const { logout } = useAuthStore();

  return (
    <View style={styles.liveContainer}>
      <Text style={styles.liveTitle}>Live Features</Text>
      
      <TouchableOpacity
        style={styles.liveItem}
        onPress={() => navigation.navigate("VCRoom")}
      >
        <Text style={styles.liveEmoji}>🎙️</Text>
        <View style={styles.liveTextContainer}>
          <Text style={styles.liveLabel}>Voice Chat Rooms</Text>
          <Text style={styles.liveDesc}>Join live voice discussions</Text>
        </View>
        <Text style={styles.liveArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.liveItem}
        onPress={() => navigation.navigate("TalkWithRua")}
      >
        <Text style={styles.liveEmoji}>🤖</Text>
        <View style={styles.liveTextContainer}>
          <Text style={styles.liveLabel}>Talk with AI (Rua)</Text>
          <Text style={styles.liveDesc}>Chat with AI assistant</Text>
        </View>
        <Text style={styles.liveArrow}>›</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Live Stack ────────────────────────────────────────────────────────────
function LiveStackNavigator() {
  return (
    <LiveStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <LiveStack.Screen name="LiveMenu" component={LiveMenuScreen} options={{ title: "Live Features" }} />
      <LiveStack.Screen name="VCRoom" component={VCRoom} options={{ title: "Voice Rooms 🎙️" }} />
      <LiveStack.Screen name="TalkWithRua" component={TalkWithRua} options={{ title: "AI Chat 🤖" }} />
    </LiveStack.Navigator>
  );
}

// ─── Main Tabs ─────────────────────────────────────────────────────────────
export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Courses"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Courses"
        component={Courses}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Courses" emoji="📚" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Live"
        component={LiveStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Live" emoji="🎙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.sm,
  },
  tabIconFocused: {
    // optional glow effect
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  tabLabelFocused: {
    color: COLORS.primary,
    fontWeight: "bold",
  },

  // Live Menu
  liveContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
  },
  liveTitle: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.textPrimary,
    fontWeight: "bold",
    marginBottom: SPACING.xl,
  },
  liveItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  liveEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  liveTextContainer: {
    flex: 1,
  },
  liveLabel: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: "bold",
  },
  liveDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  liveArrow: {
    fontSize: 22,
    color: COLORS.textMuted,
  },

  // More Menu (keep for compatibility)
  moreContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
  },
  moreTitle: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.textPrimary,
    fontWeight: "bold",
    marginBottom: SPACING.xl,
  },
  moreItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moreEmoji: {
    fontSize: 22,
    marginRight: SPACING.md,
  },
  moreLabel: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  moreArrow: {
    fontSize: 22,
    color: COLORS.textMuted,
  },
  logoutBtn: {
    marginTop: SPACING.xxl,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.md,
    fontWeight: "bold",
  },
});