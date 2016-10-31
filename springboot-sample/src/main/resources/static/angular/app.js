var spApp = angular.module('spApp', []);

spApp.controller('mainController', function($scope, $http) {

	$scope.calcList = [];
	$scope.symbol = "ORCL"

  $scope.doDefaultBanner = function() {
    $scope.bannerText = "Controller Injected Banner Text";
  };

  $scope.doAlternateBanner = function() {
    $scope.bannerText = "Welcome"
  }

  $scope.doGibberishBanner = function() {
    $scope.bannerText = "Yoli olacid ogecox aset!"
  }

  $scope.doInvokeMessage = function() {
	  $http.get('gw/message').then(
			  function(response) {
				  $scope.bannerText = response.data.message;
			  }
	  );
  }

  $scope.doInvokeHostname = function() {
	  $http.get('gw/hostname').then(
			  function(response) {
				  $scope.bannerText = "Served from: "+response.data.hostname;
			  }
	  )
  }

  $scope.doInvokeCalcSum = function() {
	  $http.get('api/randomsum', {params: {index: $scope.calcIndex}}).then(
			  function(response) {
				  $scope.calcList.push(response.data);
			  },
			  function(response) {
				  var calcData = {
						  size: response.data.exception,
						  sum: response.data.error,
						  intAtIndex: response.data.path
				  };
				  $scope.calcList.push(calcData);
			  }
	  )
  }

  $scope.doQuote = function() {
	  $http.get('gw/quote', {params: {symbol: $scope.symbol}}).then(
			  function(response) {
				  $scope.quoteText = response.data;
			  }
	  )
  }

  $scope.doDefaultBanner();
});
