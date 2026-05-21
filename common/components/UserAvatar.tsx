import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { getImageUrl } from '@/constants'

type Props = {
  imageUrl?: string | null
  name?: string | null
  size?: number
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}

export default function UserAvatar({ imageUrl, name, size = 40 }: Props) {
  const url = imageUrl ? getImageUrl(imageUrl) : null

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode='cover'
      />
    )
  }

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.35 }]}>{getInitials(name || 'U')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: { backgroundColor: '#1976D2', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontFamily: 'Manrope-Bold' }
})
