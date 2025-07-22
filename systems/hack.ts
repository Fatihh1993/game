import { Dimensions } from 'react-native';
import { Lang } from '../translations';

// Artık snippet listesini dışarıdan alıyoruz
export const hackSystem = (
  handleAnswer: Function,
  snippets: any[],
  uiLanguage: Lang,
) => {
  return (entities: any, { events }: any) => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const snippetWidth = 340;
    const maxLeft = screenWidth - snippetWidth - 10;

    // Rastgele snippet seç
    const createSnippetEntity = () => {
      if (!snippets || snippets.length === 0) return null;
      const item = snippets[Math.floor(Math.random() * snippets.length)];
      const newId = `snippet${Math.floor(Math.random() * 100000)}`;
      const isGold = Math.random() < 0.2;
      const entity: any = {
        position: [Math.random() * maxLeft, 0],
        code: item.code,
        isCorrect: item.isCorrect,
        isGold,
        explanation: item.explanations, // <-- explanations!
        renderer: require('../components/Snippet').Snippet,
        uiLanguage,
        showingExplanation: false,
      };
      entity.onAnswer = (answer: boolean | null) =>
        handleAnswer(answer, isGold, newId);
      entity.onToggleExplanation = (val: boolean) => {
        entity.showingExplanation = val;
      };
      return { newId, entity };
    };

    const snippetKeys = Object.keys(entities).filter(
      key => entities[key]?.renderer && entities[key]?.code,
    );

    // Oyun başlarken ilk snippet'ı ekle
    if (snippetKeys.length === 0 && snippets.length > 0) {
      const created = createSnippetEntity();
      if (created) {
        entities[created.newId] = created.entity;
      }
    }

    // Kullanıcı "Devam Et" diyince eskiyi silip yenisini getir
    if (events) {
      for (let event of events) {
        if (event.type === 'REMOVE_SNIPPET') {
          delete entities[event.id];
          const created = createSnippetEntity();
          if (created) {
            entities[created.newId] = created.entity;
          }
        }
      }
    }

    // Hareket ettirme (ama açıklama açıksa durdur)
    for (let key in entities) {
      const entity = entities[key];
      if (!entity?.position) continue;
      if (entity.showingExplanation) continue; // açıklama açıkken dur
      entity.position[1] += 2;
      if (entity.position[1] > screenHeight - 100) {
        handleAnswer(false, entity.isGold, key);
      }
    }

    return entities;
  };
};
