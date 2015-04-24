
/**
 * Module dependencies.
 */

import angular from 'angular';

/**
 * Token provider.
 */

function OAuthTokenProvider() {
  var storage;
  var config = {
    name: 'token',
    storage: 'cookies',//cookies,localStorage,sessionStorage
    options: {
      secure: true
    }
  };

  /**
   * Configure.
   *
   * @param {object} params - An `object` of params to extend.
   */

  this.configure = function(params) {
    // Check if is an `object`.
    if (!(params instanceof Object)) {
      throw new TypeError('Invalid argument: `config` must be an `Object`.');
    }

    // Extend default configuration.
    angular.extend(config, params);

    return config;
  };

  /**
   * OAuthToken service.
   *
   * @ngInject
   */

  this.$get = function(ipCookie) {
    class OAuthToken {

      /**
       * Set token.
       */

      set token(data) {
        return setToken(data);
      }

      /**
       * Get token.
       */

      get token() {
        return getToken();
      }

      /**
       * Get accessToken.
       */

      getAccessToken() {
        return this.token ? this.token.access_token : undefined;
      }

      /**
       * Get authorizationHeader.
       */

      getAuthorizationHeader() {
        if (!(this.getTokenType() && this.getAccessToken())) {
          return;
        }

        return `${this.getTokenType().charAt(0).toUpperCase() + this.getTokenType().substr(1)} ${this.getAccessToken()}`;
      }

      /**
       * Get refreshToken.
       */

      getRefreshToken() {
        return this.token ? this.token.refresh_token : undefined;
      }

      /**
       * Get tokenType.
       */

      getTokenType() {
        return this.token ? this.token.token_type : undefined;
      }

      /**
       * Remove token.
       */

      removeToken() {
        return removeToken();
      }

    }

    /**
     * setToken
     *
     * @param data
     * @returns {*}
     */
    var setToken = function(data) {
     storage = config.storage.toLowerCase();
      switch (storage) {
       case 'cookies':
        return ipCookie(config.name, data, config.options);
       case 'localstorage':
        return localStorage.setItem(config.name,JSON.stringify(data));
       case 'sessionstorage':
        return sessionStorage.setItem(config.name,JSON.stringify(data));
       default :
        return ipCookie(config.name, data, config.options);
      }
    };

    /**
     * getToken
     *
     * @returns {*}
     */
    var getToken = function() {
     storage = config.storage.toLowerCase();
      switch (storage) {
       case 'cookies':
        return ipCookie(config.name);
       case 'localstorage':
        return JSON.parse(localStorage.getItem(config.name));
       case 'sessionstorage':
        return JSON.parse(sessionStorage.getItem(config.name));
       default :
        return ipCookie(config.name);

      }
    };

    /**
     * removeToken
     *
     * @returns {*}
     */
    var removeToken = function() {
     storage = config.storage.toLowerCase();
      switch (storage) {
       case 'cookies':
        return ipCookie.remove(config.name, config.options);
          case 'localstorage':
            return localStorage.removeItem(config.name);
          case 'sessionstorage':
            return sessionStorage.removeItem(config.name);
          default :
            return ipCookie.remove(config.name, config.options);

      }
    };

    return new OAuthToken();
  };
}

/**
 * Export `OAuthTokenProvider`.
 */

export default OAuthTokenProvider;
