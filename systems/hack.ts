import { Dimensions } from 'react-native';

export const hackSystem = (handleAnswer: Function, selectedLanguage: string) => {
  return (entities: any, { events }: any) => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const snippetWidth = 340;
    const maxLeft = screenWidth - snippetWidth - 10;

    const allSnippets: Record<string, { code: string; isCorrect: boolean; explanation?: string }[]> = {
      csharp: [
  { code: 'int x = 5;', isCorrect: true, explanation: 'Bu, geçerli bir tam sayı değişkeni tanımıdır. C#’ta veri tipi önce, ardından isim ve değer gelir.' },
  { code: 'int = x 5;', isCorrect: false, explanation: 'Yanlış sözdizimi. Önce tip (int), sonra değişken adı (x) ve ardından = ile atama yapılmalıdır.' },
  { code: 'Console.WriteLine("Merhaba");', isCorrect: true, explanation: 'C# dilinde ekrana yazı yazdırmak için Console.WriteLine() doğru bir yöntemdir.' },
  { code: 'Console.Readln();', isCorrect: false, explanation: 'Readln yanlış yazılmıştır. C#’ta kullanıcıdan girdi almak için Console.ReadLine() kullanılmalıdır.' },
  { code: 'string ad = "Ali";', isCorrect: true, explanation: 'Bir string (metin) değişkeni doğru şekilde tanımlanmış ve değer atanmıştır.' },
  { code: 'string = "Ali" ad;', isCorrect: false, explanation: 'Değişken adı string tipinden sonra gelmelidir. Ayrıca atama operatörü (=) değişken adı ile değer arasında olmalıdır.' },
  { code: 'if(x > 10) { Console.WriteLine("Büyük"); }', isCorrect: true, explanation: 'Bu, doğru sözdizimiyle yazılmış bir if bloğudur. Parantezler ve süslü parantezler doğru kullanılmış.' },
  { code: 'if x > 10 Console.WriteLine("Büyük");', isCorrect: false, explanation: 'C#’ta if koşulu parantez içinde yazılmalı ve ardından süslü parantezlerle blok belirtilmelidir.' },
  { code: 'for(int i = 0; i < 5; i++) { Console.WriteLine(i); }', isCorrect: true, explanation: 'Bu geçerli bir for döngüsüdür. Sayaç, koşul ve artış kısmı doğru şekilde belirtilmiştir.' },
  { code: 'for i = 0 to 5 { print(i) }', isCorrect: false, explanation: 'Bu sözdizimi C# için geçerli değildir. Bu daha çok Python veya BASIC’e benzer.' },
  { code: 'double pi = 3.14;', isCorrect: true, explanation: 'Ondalıklı sayı için double veri tipi doğru şekilde kullanılmış.' },
  { code: 'double pi = "3.14";', isCorrect: false, explanation: 'Çift tırnak içinde 3.14 bir string’tir. double tipi için tırnaksız sayı verilmelidir.' },
  { code: 'bool aktif = true;', isCorrect: true, explanation: 'Boolean değişken tanımı doğru yapılmış. true ya da false değerleri alabilir.' },
  { code: 'bool aktif = "true";', isCorrect: false, explanation: 'true değeri string olarak değil, doğrudan boolean değer olarak yazılmalıdır.' },
  { code: 'Console.WriteLine(5 + 3);', isCorrect: true, explanation: 'Bu ifade 8 değerini ekrana yazdırır. Toplama işlemi doğrudur.' },
  { code: 'Console.WriteLine("5" + 3);', isCorrect: true, explanation: 'Bu ifade "53" sonucunu verir çünkü string ile int toplanınca int string’e dönüştürülür.' },
  { code: 'List<string> isimler = new List<string>();', isCorrect: true, explanation: 'Bu, string tipi bir liste oluşturmak için doğru bir C# tanımıdır.' },
  { code: 'List<string> isimler = List<string>();', isCorrect: false, explanation: 'new anahtar kelimesi olmadan nesne oluşturulamaz. C#’ta nesne oluşturmak için new zorunludur.' },
  { code: 'try { int a = 5 / 0; } catch(Exception ex) { Console.WriteLine(ex.Message); }', isCorrect: true, explanation: 'Bu, try-catch bloğu ile hata yakalama örneğidir. 0’a bölme hatası düzgün şekilde ele alınmış.' },
  { code: 'int[] sayilar = {1, 2, 3, 4};', isCorrect: true, explanation: 'Bu, bir tamsayı dizisinin doğru şekilde tanımlanmasıdır.' }
],
      sql: [
        { code: 'SELECT * FROM users;', isCorrect: true },
        { code: 'SELECT WHERE users;', isCorrect: false, explanation: 'WHERE yanlış yerde kullanılmış.' },
      ],
      javascript: [
        { code: 'let x = 5;', isCorrect: true },
        { code: 'let x == 5;', isCorrect: false, explanation: '== operatörü değişken tanımlarken kullanılmaz.' },
      ],
      python: [
        { code: 'x = 5', isCorrect: true },
        { code: 'x == 5', isCorrect: false, explanation: 'Bu karşılaştırma ama atama yapılmak isteniyor.' },
      ],
    };

    const createSnippetEntity = (lang: string) => {
      const itemList = allSnippets[lang];
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
      const { newId, entity } = createSnippetEntity(selectedLanguage);
      entities[newId] = entity;
    }

    // Kullanıcı "Devam Et" diyince eskiyi silip yenisini getir
    if (events) {
      for (let event of events) {
        if (event.type === 'REMOVE_SNIPPET') {
          delete entities[event.id];
          const { newId, entity } = createSnippetEntity(selectedLanguage);
          entities[newId] = entity;
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
