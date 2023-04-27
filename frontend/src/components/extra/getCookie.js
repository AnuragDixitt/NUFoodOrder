function getCookie(cookieName) {
    const cookieStr = document.cookie;
    if (cookieStr) {
      const cookies = cookieStr.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${cookieName}=`)) {
            console.log(cookie.substring(cookieName.length + 1))
          return cookie.substring(cookieName.length + 1);
        }
      }
    }
    return null;
  }

  export default getCookie