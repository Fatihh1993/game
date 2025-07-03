import { Dimensions } from 'react-native';

export const hackSystem = (handleAnswer: Function) => {
  return (entities: any, { events }: any) => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const snippetWidth = 340;
    const maxLeft = screenWidth - snippetWidth - 10;

    if (events) {
      for (let event of events) {
        if (event.type === 'REMOVE_SNIPPET') {
          delete entities[event.id];

          const allSnippets = [
            { code: 'Console.WriteLine("Merhaba Dünya!");', isCorrect: true },
            { code: 'int x = 5;', isCorrect: true },
            { code: 'if (x > 0) { Console.WriteLine(x); }', isCorrect: true },
            { code: 'for (int i = 0; i < 10; i++) Console.WriteLine(i);', isCorrect: true },
            { code: 'string name = "Fatih";', isCorrect: true },
            { code: 'Console.WriteLine("Merhaba"', isCorrect: false },
            { code: 'int = x 5;', isCorrect: false },
            { code: 'if x > 0) { Console.WriteLine(x); }', isCorrect: false },
            { code: 'for int i = 0; i < 10 i++)', isCorrect: false },
            { code: 'string = name "Fatih";', isCorrect: false },
          ];

          const newId = `snippet${Math.floor(Math.random() * 100000)}`;
          const item = allSnippets[Math.floor(Math.random() * allSnippets.length)];

          entities[newId] = {
            position: [Math.random() * maxLeft, 0],
            code: item.code,
            isCorrect: item.isCorrect,
            renderer: require('../components/Snippet').Snippet,
            onAnswer: (answer: boolean) => handleAnswer(answer === item.isCorrect, newId),
          };
        }
      }
    }

    for (let key in entities) {
      const entity = entities[key];

      if (!entity || !entity.position) continue; // HATA ENGELLER 🔐

      entity.position[1] += 2;

      if (entity.position[1] > screenHeight - 100) {
        handleAnswer(false, key); // kaçtı, ceza
      }
    }

    return entities;
  };
};
