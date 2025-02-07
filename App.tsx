import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Linking, TextInput, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Video } from 'expo-av';

// Import des fichiers locaux
const bannerImage = require('./assets/banner.png');
const newsData = [
  { id: '1', image: require('./assets/images/election.png'), pdf: require('./assets/pdfs/date.pdf'), title: 'Élections 2025' },
  { id: '2', image: require('./assets/images/elect.jpeg'), pdf: require('./assets/pdfs/date.pdf'), title: 'Nouveaux candidats' },
  { id: '3', image: require('./assets/images/all.png'), pdf: require('./assets/pdfs/elect.pdf'), title: 'Réformes politiques' },
  { id: '4', image: require('./assets/images/elect.jpeg'), pdf: require('./assets/pdfs/date.pdf'), title: 'Nouveaux candidats' },
  { id: '5', image: require('./assets/images/election.png'), pdf: require('./assets/pdfs/date.pdf'), title: 'Élections 2025' },
  { id: '3', image: require('./assets/images/all.png'), pdf: require('./assets/pdfs/elect.pdf'), title: 'Réformes politiques' },
];
const videoData = [
  { id: '1', source: require('./assets/video1.mp4'), title: 'Décryptage des débats' },
  { id: '2', source: require('./assets/video.mp4'), title: 'Analyse des programmes' },
];
const lawsData = [
  { id: '1', title: 'Loi éloctorale', pdf:require('./assets/Journal Officiel_n°51 Ter du 22 janvier 2025_Code Electoral_22h.pdf') },
  { id: '2', title: 'Loi', pdf: require('./assets/gabonelect.pdf') },
];

const Tab = createBottomTabNavigator();

// Composant Recherche
function SearchBar({ setSearchQuery }: { setSearchQuery: (text: string) => void }) {
  return (
    <TextInput
      style={styles.searchBar}
      placeholder="Rechercher..."
      onChangeText={(text) => setSearchQuery(text)}
    />
  );
}

// Page Actualités avec recherche et pagination
function NewsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(newsData.slice(0, 2));
  const [page, setPage] = useState(1);

  const filteredData = data.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const loadMore = () => {
    if (data.length < newsData.length) {
      setPage(page + 1);
      setData(newsData.slice(0, (page + 1) * 2));
    }
  };

  return (
    <View>
      <SearchBar setSearchQuery={setSearchQuery} />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => Linking.openURL(item.pdf)}>
            <Image source={item.image} style={styles.newsImage} />
            <Text style={styles.newsTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

// Page Décryptage avec recherche
function AnalysisScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = videoData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <SearchBar setSearchQuery={setSearchQuery} />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Video source={item.source} useNativeControls resizeMode="contain" style={styles.video} />
            <Text style={styles.videoTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

// Page FAQ avec ajout de commentaires
function FAQScreen() {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.faqTitle}>Posez vos questions :</Text>
      <TextInput
        style={styles.commentInput}
        placeholder="Écrivez votre question..."
        value={newComment}
        onChangeText={(text) => setNewComment(text)}
      />
      <Button title="Envoyer" onPress={addComment} />
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.comment}>{item}</Text>}
      />
    </View>
  );
}

// Page Lois avec recherche
function LawsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = lawsData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <SearchBar setSearchQuery={setSearchQuery} />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => Linking.openURL(item.pdf)}>
            <Text style={styles.lawText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const candidatesData = [
  { 
    id: '1', 
    name: 'Brice OLIGUI', 
    image: require('./assets/Brice.png'), 
    details: 'Expérience politique : 10 ans...', 
    video: require('./assets/candidate1.mp4') 
  },
  { 
    id: '2', 
    name: 'MANFOUMBI', 
    image: require('./assets/Colonel MANFOUMBI MANFOUMBI.webp'), 
    details: 'Programme axé sur l\'économie...', 
    video: require('./assets/candidate2.mp4') 
  },
  { 
    id: '3', 
    name: 'ONDO OSSA', 
    image: require('./assets/ondo.png'), 
    details: 'Engagement pour la jeunesse...', 
    video: require('./assets/candidate3.mp4') 
  },
];

// Page Candidats (Stories Instagram)
function CandidatesScreen() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <View style={styles.candidatesContainer}>
      <FlatList
        data={candidatesData}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.candidateStory} onPress={() => setSelectedCandidate(item)}>
            <Image source={item.image} style={styles.candidateImage} />
            <Text style={styles.candidateName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal pour afficher les détails et la vidéo du candidat */}
      <Modal visible={!!selectedCandidate} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCandidate && (
              <>
                <Image source={selectedCandidate.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedCandidate.name}</Text>
                <Text style={styles.modalText}>{selectedCandidate.details}</Text>

                {/* Vidéo du candidat */}
                <Video
                  source={selectedCandidate.video}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                  shouldPlay={false}
                />

                <Button title="Fermer" onPress={() => setSelectedCandidate(null)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const Tab = createBottomTabNavigator();



export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={bannerImage} style={styles.banner} />
        </View>
        <Tab.Navigator>
          <Tab.Screen name="Actualités" component={NewsScreen} />
          <Tab.Screen name="Décryptages" component={AnalysisScreen} />
          <Tab.Screen name="FAQ" component={FAQScreen} />
          <Tab.Screen name="Lois Électorales" component={LawsScreen} />
          <Tab.Screen name="Candidats" component={CandidatesScreen} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  banner: { width: '100%', height: '100%', resizeMode: 'cover' },
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  searchBar: { height: 40, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, margin: 10, paddingLeft: 10 },
  newsImage: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10 },
  newsTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  video: { width: '100%', height: 200, marginBottom: 10 },
  videoTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  lawText: { fontSize: 18, padding: 10, color: 'blue' },
  faqTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  commentInput: { height: 40, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingLeft: 10, marginBottom: 10, width: '90%' },
  comment: { fontSize: 16, marginVertical: 5, paddingHorizontal: 10 },
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  banner: { width: '100%', height: '100%', resizeMode: 'cover' },

  // Styles des candidats
  candidatesContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  candidateStory: { alignItems: 'center', marginHorizontal: 10 },
  candidateImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: 'blue' },
  candidateName: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },

  // Styles du modal
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  
  // Styles de la vidéo
  video: { width: 300, height: 200, marginTop: 10, borderRadius: 10 },
});
