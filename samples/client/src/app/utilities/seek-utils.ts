export abstract class SeekStructUtils {
  /**
   * Filter array by string
   *
   * @param mainArr
   * @param searchText
   * @returns {any}
   */
  public static filterArrayByString<T = any>(
    mainArr: T[],
    searchText: string
  ): T[] {
    if (searchText === '') {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr.filter((itemObj: Object) => {
      return this.searchInObj(itemObj, searchText);
    });
  }

  /**
   * Search in object
   *
   * @param itemObj
   * @param searchText
   * @returns {boolean}
   */
  public static searchInObj(itemObj, searchText): boolean {
    for (const prop in itemObj) {
      if (!itemObj.hasOwnProperty(prop)) {
        continue;
      }

      const value = itemObj[prop];

      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
  }

  /**
   * Search in array
   *
   * @param arr
   * @param searchText
   * @returns {boolean}
   */
  public static searchInArray(arr, searchText): boolean {
    for (const value of arr) {
      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
  }

  /**
   * Search in string
   *
   * @param value
   * @param searchText
   * @returns {any}
   */
  public static searchInString(value, searchText): any {
    return value.toLowerCase().includes(searchText);
  }

  /**
   * Generate a unique GUID
   *
   * @returns {string}
   */
  public static generateGUID(): string {
    function S4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return S4() + S4();
  }

  /**
   * Toggle in array
   *
   * @param item
   * @param array
   */
  public static toggleInArray(item, array): void {
    if (array.indexOf(item) === -1) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item), 1);
    }
  }

  /**
   * Handleize
   *
   * @param text
   * @returns {string}
   */
  public static handleize(text): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  /**
   * uuid v4 generator
   * @returns {string} UUID
   */
  public static UUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line: no-bitwise
      const r = (Math.random() * 16) | 0;
      // tslint:disable-next-line: no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
