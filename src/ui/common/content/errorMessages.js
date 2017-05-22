var errMessages = {
  INVALID_SINGLE_WORD_INPUT :
      "Invalid Input! \n \
       Words that can be stemmed can ONLY include: \n\
            - Lowercase letters 'a'-'z' inclusive\n\
      ",

  INVALID_URL_INPUT :
      "Invalid Input!\n \
            - The URL you provided is not supported by this stemmer =/\n \
            - Please provide something in the 'http(s)://url.com/file.txt' format\n\
      ",

  NO_TXT_ENTERED :
      "You did not enter any text!\n\
      - Please enter a word, or url, and choose the correct corresponding action\n\
      ",

  WORD_DOES_NOT_EXIST :
      "Sorry that word was not found in the lookup =/\n\
      - Reasons why the word was not found:\n\
        - It was not found in the list of words found at the URL provided\n\
        - It was removed during the stemming process as it did not meet the intended criteria\n\
      \n\
      - Words that can be stemmed MUST:\n\
        - Only cotain characters 'a'-'z' (inclusive)\n\
        - Contain no white spaces\n\
        - Be a singular word and not a phrase\n\
      ",
  NO_WORD_LIST_YET :
    "You must enter a URL that has an available word list first, in order to lookup a word"
};
