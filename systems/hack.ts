import { Dimensions } from 'react-native';

export const hackSystem = (handleAnswer: Function, selectedLanguage: string) => {
  return (entities: any, { events }: any) => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const snippetWidth = 340;
    const maxLeft = screenWidth - snippetWidth - 10;

    const allSnippets: Record<string, { code: string; isCorrect: boolean; explanation?: string }[]> = {
      csharp: [
  {
    "code": "int x = 5;",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde bir tam sayı (integer) değişkeni olan 'x'i tanımlar ve ona '5' değerini atar. Değişken tanımlaması için önce tip (int), sonra değişken adı (x) ve ardından atama operatörü (=) ile değer belirtilir."
  },
  {
    "code": "int = x 5;",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. C# dilinde değişken tanımlarken tipin ardından değişken adı gelmeli ve değer ataması için '=' operatörü kullanılmalıdır. 'int = x 5;' yazımı söz dizimi hatası içerir."
  },
  {
    "code": "Console.WriteLine(\"Merhaba\");",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde konsola (\"Merhaba\") metnini yazdırır. 'Console.WriteLine' metodu, parantez içindeki ifadeyi ekrana çıktı olarak gösterir ve bir alt satıra geçer."
  },
  {
    "code": "if x > 0) { Console.WriteLine(x); }",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. C# dilinde 'if' koşul ifadelerinde parantezlerin doğru bir şekilde açılıp kapanması gerekir. Burada 'if' ifadesinin açılış parantezi eksiktir (doğrusu 'if (x > 0)')."
  },
  {
    "code": "string s = \"hello\";",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde bir metin (string) değişkeni olan 's'i tanımlar ve ona \"hello\" metin değerini atar. Metin değerleri her zaman çift tırnak (\" \") içine alınmalıdır."
  },
  {
    "code": "string s = hello;",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. C# dilinde metin (string) değerleri, derleyici tarafından metin olarak tanınması için **çift tırnak (\" \") içine alınmalıdır**. Aksi takdirde, 'hello' bir değişken veya anahtar kelime olarak algılanmaya çalışılır ve hata verir."
  },
  {
    "code": "for(int i=0;i<10;i++){}",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde klasik bir 'for' döngüsüdür. 'i' değişkeni 0'dan başlar, 10'dan küçük olduğu sürece döngü devam eder ve her adımda 'i' bir artırılır. Genellikle belirli sayıda tekrar etmek için kullanılır."
  },
  {
    "code": "for i = 0 to 10 { }",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. Bu söz dizimi C# diline ait değildir; daha çok Visual Basic gibi dillerde kullanılır. C# 'for' döngüsünün kendine özgü bir yapısı vardır (parantezler, noktalı virgüller ve artırma/azaltma ifadesi)."
  },
  {
    "code": "List<int> numbers = new List<int>();",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde generic bir liste olan 'List<int>' tipinde 'numbers' adında yeni bir liste nesnesi oluşturur. Bu liste sadece tam sayı (int) değerleri tutabilir ve 'new' anahtar kelimesi ile örneği (instance) yaratılır."
  },
  {
    "code": "List<int> numbers = List();",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. C# dilinde bir sınıfın yeni bir örneğini oluşturmak için 'new' anahtar kelimesi kullanılmalıdır. 'List()' yazımı, 'List' sınıfının varsayılan yapıcı metodunu çağırmak için yeterli değildir; 'new List<int>()' olmalıdır."
  },
  {
    "code": "public void MyMethod() {}",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde parametre almayan ve değer döndürmeyen ('void') 'MyMethod' adında bir metot tanımlar. 'public' erişim belirleyicisi, bu metoda her yerden erişilebileceğini belirtir. Metotlar, belirli bir işlevi yerine getiren kod bloklarıdır."
  },
  {
    "code": "public void MyMethod[] {}",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. C# dilinde metot tanımlarında metot adından sonra parametre listesi için normal parantezler '()' kullanılır. Köşeli parantezler '[]' dizileri tanımlamak için kullanılır ve metot tanımlamalarında yeri yoktur."
  },
  {
    "code": "var dict = new Dictionary<int, string>();",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde 'var' anahtar kelimesini kullanarak 'Dictionary<int, string>' tipinde 'dict' adında yeni bir sözlük nesnesi oluşturur. 'var' anahtar kelimesi, değişkenin tipinin derleyici tarafından otomatik olarak çıkarılmasını sağlar. Sözlükler, anahtar-değer çiftlerini saklamak için kullanılır."
  },
  {
    "code": "var dict = Dictionary<int, string>();",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. 'Dictionary' sınıfının yeni bir örneğini oluşturmak için 'new' anahtar kelimesi gereklidir. 'Dictionary<int, string>()' yazımı, bir sınıfın yapıcı metodunu doğrudan çağırmak için yeterli değildir."
  },
  {
    "code": "if(a == b) { return true; }",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde bir 'if' koşul ifadesidir. '==' operatörü, 'a' ve 'b' değişkenlerinin değerlerinin eşit olup olmadığını kontrol eder. Eğer eşitse, metot 'true' değerini döndürür. Karşılaştırma operatörlerinin doğru kullanımı önemlidir."
  },
  {
    "code": "if a = b then return true;",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. Bu söz dizimi C# diline ait değildir; 'then' anahtar kelimesi C# 'if' ifadelerinde kullanılmaz ve '=' operatörü C# dilinde **atama** için kullanılırken, **eşitlik kontrolü** için '==' operatörü kullanılır. Bu hatalı kullanım, 'b'nin değerini 'a'ya atamaya çalışır."
  },
  {
    "code": "double d = 3.14;",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde ondalıklı sayıları tutmak için kullanılan 'double' tipinde 'd' adında bir değişken tanımlar ve ona '3.14' değerini atar. 'double' tipi, 'float'a göre daha fazla hassasiyet sunar."
  },
  {
    "code": "double d == 3.14;",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. '==' operatörü **karşılaştırma** yapmak için kullanılırken, '=' operatörü **atama** yapmak için kullanılır. Burada 'd' değişkenine '3.14' değerini atamak istendiği için '=' kullanılmalıdır. Bu yazım söz dizimi hatasıdır."
  },
  {
    "code": "Console.ReadLine();",
    "isCorrect": true,
    "explanation": "Bu kod, C# dilinde konsoldan kullanıcıdan bir satır metin girişi okur. Genellikle kullanıcının klavyeden veri girmesini beklemek ve bu veriyi almak için kullanılır. Okunan değer bir 'string' olarak döndürülür."
  },
  {
    "code": "Console.Readln();",
    "isCorrect": false,
    "explanation": "Bu kod hatalıdır. 'Console' sınıfının metin okuma metodu 'ReadLine()' şeklindedir, 'Readln()' şeklinde değildir. Büyük/küçük harf duyarlılığı ve doğru metot adı kullanımı C# dilinde önemlidir."
  }
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
        explanation: item.explanation,
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
            explanation: item.explanation,
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
