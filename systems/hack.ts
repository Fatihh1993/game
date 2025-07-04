import { Dimensions } from 'react-native';

export const hackSystem = (handleAnswer: Function, selectedLanguage: string) => {
  return (entities: any, { events }: any) => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const snippetWidth = 340;
    const maxLeft = screenWidth - snippetWidth - 10;

    const allSnippets: Record<string, { code: string; isCorrect: boolean }[]> = {
      csharp: [
        { code: 'int x = 5;', isCorrect: true },
        { code: 'int = x 5;', isCorrect: false },
        { code: 'Console.WriteLine("Merhaba");', isCorrect: true },
        { code: 'if x > 0) { Console.WriteLine(x); }', isCorrect: false },
        { code: 'string s = "hello";', isCorrect: true },
        { code: 'string s = hello;', isCorrect: false },
        { code: 'for(int i=0;i<10;i++){}', isCorrect: true },
        { code: 'for i = 0 to 10 { }', isCorrect: false },
        { code: 'List<int> numbers = new List<int>();', isCorrect: true },
        { code: 'List<int> numbers = List();', isCorrect: false },
        { code: 'public void MyMethod() {}', isCorrect: true },
        { code: 'public void MyMethod[] {}', isCorrect: false },
        { code: 'var dict = new Dictionary<int, string>();', isCorrect: true },
        { code: 'var dict = Dictionary<int, string>();', isCorrect: false },
        { code: 'if(a == b) { return true; }', isCorrect: true },
        { code: 'if a = b then return true;', isCorrect: false },
        { code: 'double d = 3.14;', isCorrect: true },
        { code: 'double d == 3.14;', isCorrect: false },
        { code: 'Console.ReadLine();', isCorrect: true },
        { code: 'Console.Readln();', isCorrect: false },
      ],
      sql: [
        { code: 'SELECT * FROM users;', isCorrect: true },
        { code: 'SELECT WHERE users;', isCorrect: false },
        { code: 'DELETE FROM table WHERE id = 1;', isCorrect: true },
        { code: 'INSERT table users VALUES ();', isCorrect: false },
        { code: 'UPDATE users SET name = "Ali" WHERE id = 2;', isCorrect: true },
        { code: 'UPDATE SET name = "Ali" users;', isCorrect: false },
        { code: 'CREATE TABLE test (id INT);', isCorrect: true },
        { code: 'CREATE test TABLE (id INT);', isCorrect: false },
        { code: 'DROP TABLE users;', isCorrect: true },
        { code: 'DROP users TABLE;', isCorrect: false },
        { code: 'ALTER TABLE users ADD age INT;', isCorrect: true },
        { code: 'ALTER users TABLE ADD age INT;', isCorrect: false },
        { code: 'SELECT name FROM users WHERE id = 1;', isCorrect: true },
        { code: 'SELECT FROM name users WHERE id = 1;', isCorrect: false },
        { code: 'INSERT INTO users (name) VALUES ("Veli");', isCorrect: true },
        { code: 'INSERT users (name) VALUES ("Veli");', isCorrect: false },
        { code: 'SELECT COUNT(*) FROM users;', isCorrect: true },
        { code: 'SELECT COUNT FROM users;', isCorrect: false },
        { code: 'TRUNCATE TABLE users;', isCorrect: true },
        { code: 'TRUNCATE users TABLE;', isCorrect: false },
      ],
      javascript: [
        { code: 'let x = 5;', isCorrect: true },
        { code: 'let x == 5;', isCorrect: false },
        { code: 'console.log("Hello");', isCorrect: true },
        { code: 'console.log("Hello"', isCorrect: false },
        { code: 'const arr = [1,2,3];', isCorrect: true },
        { code: 'const arr = 1,2,3;', isCorrect: false },
        { code: 'if (x === 5) { }', isCorrect: true },
        { code: 'if x = 5 { }', isCorrect: false },
        { code: 'function test() { return 1; }', isCorrect: true },
        { code: 'function test[] { return 1; }', isCorrect: false },
        { code: 'let obj = {a:1};', isCorrect: true },
        { code: 'let obj = (a:1);', isCorrect: false },
        { code: 'for(let i=0;i<10;i++){}', isCorrect: true },
        { code: 'for i = 0 to 10 { }', isCorrect: false },
        { code: 'const sum = (a,b) => a+b;', isCorrect: true },
        { code: 'const sum = a,b => a+b;', isCorrect: false },
        { code: 'document.getElementById("id");', isCorrect: true },
        { code: 'document.getElementByID("id");', isCorrect: false },
        { code: 'let s = "text";', isCorrect: true },
        { code: 'let s = text;', isCorrect: false },
      ],
      python: [
        { code: 'x = 5', isCorrect: true },
        { code: 'x == 5', isCorrect: false },
        { code: 'print("Hello")', isCorrect: true },
        { code: 'print("Hello"', isCorrect: false },
        { code: 'arr = [1,2,3]', isCorrect: true },
        { code: 'arr = 1,2,3', isCorrect: false },
        { code: 'if x == 5:', isCorrect: true },
        { code: 'if x = 5:', isCorrect: false },
        { code: 'def test():\n    return 1', isCorrect: true },
        { code: 'def test[]:\n    return 1', isCorrect: false },
        { code: 'obj = {"a": 1}', isCorrect: true },
        { code: 'obj = {a: 1}', isCorrect: false },
        { code: 'for i in range(10):', isCorrect: true },
        { code: 'for i to 10:', isCorrect: false },
        { code: 'sum = lambda a, b: a + b', isCorrect: true },
        { code: 'sum = lambda a b: a + b', isCorrect: false },
        { code: 'input("Adınız: ")', isCorrect: true },
        { code: 'input("Adınız: "', isCorrect: false },
        { code: 's = "text"', isCorrect: true },
        { code: 's = text', isCorrect: false },
      ],
    };

    // Eğer hiç snippet yoksa, ilk snippet'ı ekle
    const snippetKeys = Object.keys(entities).filter(
      key => entities[key]?.renderer && entities[key]?.code
    );
    if (snippetKeys.length === 0 && selectedLanguage) {
      const itemList = allSnippets[selectedLanguage];
      const item = itemList[Math.floor(Math.random() * itemList.length)];
      const newId = `snippet${Math.floor(Math.random() * 100000)}`;

      entities[newId] = {
        position: [Math.random() * maxLeft, 0],
        code: item.code,
        isCorrect: item.isCorrect,
        language: selectedLanguage,
        renderer: require('../components/Snippet').Snippet,
        onAnswer: (answer: boolean) => handleAnswer(answer === item.isCorrect, newId),
      };
    }

    if (events) {
      for (let event of events) {
        if (event.type === 'REMOVE_SNIPPET') {
          delete entities[event.id];

          const itemList = allSnippets[selectedLanguage];
          const item = itemList[Math.floor(Math.random() * itemList.length)];
          const newId = `snippet${Math.floor(Math.random() * 100000)}`;

          entities[newId] = {
            position: [Math.random() * maxLeft, 0],
            code: item.code,
            isCorrect: item.isCorrect,
            language: selectedLanguage,
            renderer: require('../components/Snippet').Snippet,
            onAnswer: (answer: boolean) => handleAnswer(answer === item.isCorrect, newId),
          };
        }
      }
    }

    for (let key in entities) {
      const entity = entities[key];
      if (!entity?.position) continue;

      entity.position[1] += 2;

      if (entity.position[1] > screenHeight - 100) {
        handleAnswer(false, key);
      }
    }

    return entities;
  };
};
