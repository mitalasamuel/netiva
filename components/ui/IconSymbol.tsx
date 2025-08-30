// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.outline': 'home',
  'house.fill': 'home',
  'house': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'envelope.fill': 'message',
  'person.fill': 'person',
  'person.outline': 'person',
  'person': 'person',
  'money.fill': 'money',
  'play.fill': 'play',
  'bell.fill': 'bell',
  'bell.outline': 'notifications',
  'bell': 'notifications',
  'plus.fill': 'plus',
  'school': 'school',
  'school.outline': 'school',
  'calendar-check': 'event-available',
  'calendar-outline': 'event',
  'notifications': 'notifications',
  'notifications-outline': 'notifications-none',
  'book': 'book',
  'book.fill': 'book',
  'description': 'description',
  'home': 'home',
  'home-outline': 'home',
  'arrow-forward': 'arrow-forward',
  'check-circle': 'check-circle',
  'info': 'info',
  'refresh': 'refresh',
  'receipt': 'receipt',
  'warning': 'warning',
  'assessment': 'assessment',
  'comment': 'comment',
  'payment': 'payment',
  'video-library': 'video-library',
  'event-available': 'event-available',
  'event': 'event',
  'wc': 'wc',
  'email': 'email',
  'location-on': 'location-on',
  'phone': 'phone',
  'emergency': 'emergency',
  'logout': 'logout',
  'download': 'download',
  'circle': 'circle',
  'arrow-back': 'arrow-back',
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * 
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
