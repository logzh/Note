$scope.thread.start = threads.length;//初始化 下次拉取帖子的开始位置
$scope.thread.hasMore = threads.length == 7;//初始化 是否还有更多的帖子

var loading = false;

var getMore = function(position) {//根据开始位置拉取更多帖子
  if ($scope.thread.hasMore) {
    $scope.thread.pullLoading = true;//正在加载帖子 标记
    My.thread('position=' + position).then(function(res) {//$http 获取帖子返回 promise
      $scope.thread.start = $scope.thread.start + res.length;
      $scope.thread.hasMore = res.length == 4;
      angular.forEach(res, function(item, i) {
        if (angular.isString(item.media)) {
          item.media = (item.media).split('|').splice(0, 3);
        } else {
          item.media = [];
        }
        $scope.threads.push(item);
      });
      loading = false;
      $scope.thread.pullLoading = false;
    });
  }
};

var debounced = _.debounce(function() {
  var winHeight = $window.innerHeight;
  var pageYOffset = $window.pageYOffset;//通过$window服务获取下拉位置 浏览器原生window没有该参数

  if ((winHeight - pageYOffset <= 200) && !loading && $scope.thread.hasMore) {
    loading = true;
    getMore($scope.thread.start);
  }
}, 500); // Executes 500ms after last call of the debounced function.
angular.element(document).on('scroll', debounced);

/*
 throttle 和 debounce 是解决请求和响应速度不匹配问题的两个方案。二者的差异在于选择不同的策略。
 电梯超时
 想象每天上班大厦底下的电梯。把电梯完成一次运送，类比为一次函数的执行和响应。假设电梯有两种运行策略 throttle 和 debounce ，超时设定为15秒，不考虑容量限制。
 throttle 策略的电梯。保证如果电梯第一个人进来后，15秒后准时运送一次，不等待。如果没有人，则待机。
 debounce 策略的电梯。如果电梯里有人进来，等待15秒。如果又人进来，15秒等待重新计时，直到15秒超时，开始运送。
 */