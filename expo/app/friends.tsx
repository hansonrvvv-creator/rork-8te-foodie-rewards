import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { UserPlus, Users, Facebook, X } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useUser, FacebookFriend } from '@/contexts/UserContext';

WebBrowser.maybeCompleteAuthSession();

// TODO: Replace with your actual Facebook App ID from https://developers.facebook.com/
// 1. Go to https://developers.facebook.com/apps/
// 2. Create a new app or select existing app
// 3. Copy the App ID from the dashboard
// 4. Add OAuth redirect URI: rork-app://friends
const FACEBOOK_APP_ID = '1234567890'; // ⚠️ REPLACE THIS

const discovery = {
  authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
};

export default function FriendsScreen() {
  const { user, linkFacebook, unlinkFacebook } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedFriends, setSuggestedFriends] = useState<FacebookFriend[]>([]);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'rork-app',
    path: 'friends',
  });

  const [, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FACEBOOK_APP_ID,
      scopes: ['public_profile', 'user_friends'],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success') {
        const { code } = response.params;
        await handleFacebookAuth(code);
      }
    };
    handleResponse();
  }, [response]);

  const handleFacebookAuth = async (code: string) => {
    setIsLoading(true);
    try {
      const mockFriends: FacebookFriend[] = [
        {
          id: 'fb1',
          name: 'Sarah Johnson',
          picture: 'https://i.pravatar.cc/150?img=5',
          isAppUser: true,
        },
        {
          id: 'fb2',
          name: 'Mike Chen',
          picture: 'https://i.pravatar.cc/150?img=12',
          isAppUser: true,
        },
        {
          id: 'fb3',
          name: 'Emma Davis',
          picture: 'https://i.pravatar.cc/150?img=47',
          isAppUser: false,
        },
        {
          id: 'fb4',
          name: 'James Wilson',
          picture: 'https://i.pravatar.cc/150?img=33',
          isAppUser: true,
        },
        {
          id: 'fb5',
          name: 'Lisa Anderson',
          picture: 'https://i.pravatar.cc/150?img=20',
          isAppUser: false,
        },
      ];

      await linkFacebook(`fb_user_${Date.now()}`, `mock_token_${Date.now()}`, mockFriends);
      setSuggestedFriends(mockFriends);
      Alert.alert('Success', 'Connected to Facebook! Found friends using the app.');
    } catch (error) {
      console.error('Facebook auth error:', error);
      Alert.alert('Error', 'Failed to connect to Facebook. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWithFacebook = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Demo Mode',
        'Facebook authentication is not configured for this demo. In a production app, you would:\n\n1. Create a Facebook App\n2. Configure OAuth redirect URIs\n3. Use the Facebook Graph API\n\nFor now, we\'ll simulate the connection.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Simulate',
            onPress: () => handleFacebookAuth('demo_code'),
          },
        ]
      );
    } else {
      promptAsync();
    }
  };

  const disconnectFacebook = async () => {
    Alert.alert(
      'Disconnect Facebook',
      'Are you sure you want to disconnect your Facebook account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await unlinkFacebook();
            setSuggestedFriends([]);
            Alert.alert('Disconnected', 'Facebook account has been disconnected.');
          },
        },
      ]
    );
  };

  const addFriend = (friendId: string) => {
    Alert.alert('Friend Added', 'You can now see their check-ins and activity!');
  };

  const inviteFriend = (friendId: string) => {
    Alert.alert('Invitation Sent', 'Your friend will receive an invite to join the app!');
  };

  const appFriends = (user.facebookFriends || suggestedFriends).filter((f) => f.isAppUser);
  const nonAppFriends = (user.facebookFriends || suggestedFriends).filter((f) => !f.isAppUser);
  const isConnected = user.facebookId !== undefined;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Find Friends',
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFD700',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Users size={32} color="#FFD700" />
          </View>
          <Text style={styles.title}>Connect with Friends</Text>
          <Text style={styles.subtitle}>
            Find friends who also love discovering great restaurants and see where they check in!
          </Text>
        </View>

        <View style={styles.section}>
          {!isConnected ? (
            <TouchableOpacity
              style={styles.facebookButton}
              onPress={connectWithFacebook}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Facebook size={24} color="#FFFFFF" />
                  <Text style={styles.facebookButtonText}>Connect with Facebook</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.connectedCard}>
              <View style={styles.connectedHeader}>
                <View style={styles.connectedIconRow}>
                  <Facebook size={20} color="#1877F2" />
                  <Text style={styles.connectedText}>Facebook Connected</Text>
                </View>
                <TouchableOpacity onPress={disconnectFacebook}>
                  <X size={20} color="#999" />
                </TouchableOpacity>
              </View>
              <Text style={styles.connectedSubtext}>
                You can now discover friends on the app
              </Text>
            </View>
          )}
        </View>

        {isConnected && appFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Friends on the App</Text>
            <Text style={styles.sectionSubtitle}>
              {appFriends.length} {appFriends.length === 1 ? 'friend' : 'friends'} using the app
            </Text>
            {appFriends.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <Image
                  source={{ uri: friend.picture || 'https://i.pravatar.cc/150' }}
                  style={styles.friendAvatar}
                />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendStatus}>Active on the app</Text>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addFriend(friend.id)}
                >
                  <UserPlus size={18} color="#000000" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {isConnected && nonAppFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Invite Friends</Text>
            <Text style={styles.sectionSubtitle}>
              {nonAppFriends.length} {nonAppFriends.length === 1 ? 'friend' : 'friends'} not on the
              app yet
            </Text>
            {nonAppFriends.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <Image
                  source={{ uri: friend.picture || 'https://i.pravatar.cc/150' }}
                  style={styles.friendAvatar}
                />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendStatusInactive}>Not on the app</Text>
                </View>
                <TouchableOpacity
                  style={styles.inviteButton}
                  onPress={() => inviteFriend(friend.id)}
                >
                  <Text style={styles.inviteButtonText}>Invite</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {!isConnected && (
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Why Connect?</Text>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>See where your friends check in</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Discover new restaurants together</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Share your favorite dining experiences</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Compete on the leaderboard</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  facebookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  connectedCard: {
    gap: 8,
  },
  connectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  connectedIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  connectedSubtext: {
    fontSize: 14,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  friendStatus: {
    fontSize: 13,
    color: '#4CAF50',
  },
  friendStatusInactive: {
    fontSize: 13,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  inviteButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  inviteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  benefitsSection: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
  benefitText: {
    fontSize: 15,
    color: '#CCCCCC',
    flex: 1,
  },
});
