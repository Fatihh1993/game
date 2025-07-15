import { Dimensions } from 'react-native';

export const hackSystem = (handleAnswer: Function, selectedLanguage: string, currentLevel: number) => {
  return (entities: any, { events }: any) => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const snippetWidth = 340;
    const maxLeft = screenWidth - snippetWidth - 10;

    // Level'lara göre snippet'lar
    const allSnippets: Record<string, Record<number, { code: string; isCorrect: boolean; explanation?: string }[]>> = {
      csharp: {
        1: [
          { code: 'int x = 5;', isCorrect: true, explanation: 'Bu, C# dilinde bir tam sayı değişkeni tanımıdır.' },
          { code: 'int = x 5;', isCorrect: false, explanation: 'Yanlış sözdizimi. Önce tip (int), sonra değişken adı (x) ve ardından = ile atama yapılmalıdır.' },
          { code: 'string ad = "Ali";', isCorrect: true, explanation: 'Bir string değişkeni doğru şekilde tanımlanmış.' },
          { code: 'string = "Ali" ad;', isCorrect: false, explanation: 'Değişken adı string tipinden sonra gelmelidir.' },
        ],
        2: [
          { code: 'Console.WriteLine("Merhaba");', isCorrect: true, explanation: 'C# dilinde ekrana yazı yazdırmak için Console.WriteLine() kullanılır.' },
          { code: 'Console.Readln();', isCorrect: false, explanation: 'Readln yanlış yazılmıştır. Doğrusu Console.ReadLine() olmalı.' },
        ],
      },
      javascript: {
        1: [
          { code: 'let x = 5;', isCorrect: true, explanation: 'let ile değişken tanımlanır.' },
          { code: 'let x == 5;', isCorrect: false, explanation: '== operatörü değişken tanımlamada kullanılmaz.' },
        ],
        2: [
          { code: 'const y = "merhaba";', isCorrect: true, explanation: 'const ile sabit değişken tanımlanır.' },
          { code: 'const = y "merhaba";', isCorrect: false, explanation: 'Değişken adı eksik.' },
        ],
      },
      python: {
        1: [
          { code: 'x = 5', isCorrect: true, explanation: 'Python’da değişken tanımı bu şekildedir.' },
          { code: 'x == 5', isCorrect: false, explanation: '== karşılaştırma operatörüdür, atama için = kullanılır.' },
        ],
        2: [
          { code: 'y = "merhaba"', isCorrect: true, explanation: 'String ataması doğrudur.' },
          { code: 'y == "merhaba"', isCorrect: false, explanation: '== karşılaştırma yapar, atama değildir.' },
        ],
      },
      sql: {
        1: [
          { code: 'SELECT * FROM users;', isCorrect: true, explanation: 'Tüm kullanıcıları seçer.' },
          { code: 'SELECT WHERE users;', isCorrect: false, explanation: 'WHERE yanlış yerde kullanılmış.' },
        ],
        2: [
          { code: 'SELECT name FROM users;', isCorrect: true, explanation: 'Sadece name kolonunu seçer.' },
          { code: 'SELECT name users;', isCorrect: false, explanation: 'FROM eksik.' },
        ],
      },
    };

    const createSnippetEntity = (lang: string, level: number) => {
      const itemList = allSnippets[lang]?.[level] || allSnippets[lang]?.[1] || [];
      if (itemList.length === 0) return null;
      const item = itemList[Math.floor(Math.random() * itemList.length)];
      const newId = `snippet${Math.floor(Math.random() * 100000)}`;
      const entity: any = {
        position: [Math.random() * maxLeft, 0],
        code: item.code,
        isCorrect: item.isCorrect,
        explanation: item.explanation,
        renderer: require('../components/Snippet').Snippet,
        showingExplanation: false,
      };
      entity.onAnswer = (answer: boolean | null) => handleAnswer(answer, newId);
      entity.onToggleExplanation = (val: boolean) => {
        entity.showingExplanation = val;
      };
      return { newId, entity };
    };

    const snippetKeys = Object.keys(entities).filter(
      key => entities[key]?.renderer && entities[key]?.code
    );

    // Oyun başlarken ilk snippet'ı ekle
    if (snippetKeys.length === 0 && selectedLanguage) {
      const created = createSnippetEntity(selectedLanguage, currentLevel);
      if (created) {
        entities[created.newId] = created.entity;
      }
    }

    // Kullanıcı "Devam Et" diyince eskiyi silip yenisini getir
    if (events) {
      for (let event of events) {
        if (event.type === 'REMOVE_SNIPPET') {
          delete entities[event.id];
          const created = createSnippetEntity(selectedLanguage, currentLevel);
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
        handleAnswer(false, key);
      }
    }

    return entities;
  };
};
