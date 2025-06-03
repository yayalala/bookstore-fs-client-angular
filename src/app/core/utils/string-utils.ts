export class StringUtils {

  static capitalize( givenString: string): string {
    return givenString[0].toUpperCase() + givenString.slice(1);
  }

  static camelize(spacedWordsString:string): string {
    if ( spacedWordsString === '') {
      return '';
    }
    const wordsInSpacedString = spacedWordsString.split(' ');
    for (let wi = 0; wi < wordsInSpacedString.length; wi++) {
      if ( wi === 0 ) {
        wordsInSpacedString[wi] = wordsInSpacedString[wi].toLowerCase();
      }
      else {
        wordsInSpacedString[wi] = wordsInSpacedString[wi][0].toUpperCase() + wordsInSpacedString[wi].slice(1);
      }
    }
    return wordsInSpacedString.join('');
  }

  static camelCaseToTitleCase( camelCasedString : string ): string {
    let spacedCapitalized = '';
    for (const char of camelCasedString ) {
      if ( spacedCapitalized === '' ) {
        spacedCapitalized += char.toUpperCase();
      }
      else if ( char === char.toUpperCase() ) {
        spacedCapitalized += ' ' + char;
      } 
      else {
        spacedCapitalized += char;
      }
    }
    return spacedCapitalized;
  }
  
}