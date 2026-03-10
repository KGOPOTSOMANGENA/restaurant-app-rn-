import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import AdminNavigator from '../../navigation/AdminNavigator';
import { useAdminGuard } from '../../hooks/useAdminGuard';

export default function AdminRoot() {
  const allowed = useAdminGuard();
  if (allowed === null) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!allowed) return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>No admin access</Text>
    </View>
  );
  return <AdminNavigator />;
}
