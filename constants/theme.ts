import { Platform } from 'react-native';

const tintColorLight = '#E53935';
const tintColorDark = '#FF6B6B';

export const Colors = {
  light: {
    text: '#1a1a1a',
    background: '#f5f5f5',
    tint: tintColorLight,
    icon: '#666',
    tabIconDefault: '#999',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    border: '#e0e0e0',
    shadow: 'rgba(0,0,0,0.1)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0a0a0a',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
    card: '#1a1a1a',
    border: '#2a2a2a',
    shadow: 'rgba(0,0,0,0.3)',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});