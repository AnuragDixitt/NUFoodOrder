const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = '; expires=' + date.toGMTString();
    console.log(document.cookie)
    document.cookie = name + '=' + value + expires ;
  };

  export default setCookie;
  