$(document).on('turbolinks:load', function(){
  var pre_input = ""
  var search_list = $("#user-search-result");
  var member_list = $("#chat-group-users");

  // ユーザーを検索結果に加える
  function appendUserToSearchList(user) {
    var html =
      `<div class="chat-group-user clearfix">
          <p class="chat-group-user__name">${ user.name }</p>
          <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${ user.id }" data-user-name=${ user.name }>追加</a>
      </div>`
    search_list.append(html);
    return html;
  }

  // ユーザーをチャットメンバーに加える
  function appendUserToMemberList(name, user_id) {
    var html =
      `<div class='chat-group-user clearfix js-chat-member' id='chat-group-user'>
        <input name='group[user_ids][]' type='hidden' value=${ user_id }>
        <p class='chat-group-user__name'>${ name }</p>
        <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</a>
      </div>`
    member_list.append(html);
  }

  //検索結果がない場合
  function noneSearchUserResult(user) {
    let html = `<div class="chat-group-user clearfix">
                  該当ユーザーなし
                </div>`;
    search_list.append(html);
  }

  //検索結果のリセット
  function resetSearchUserResult() {
    search_list.empty();
  }


  //userを検索結果として表示するかを判定する
  function judgeSearchUserResult(users) {
    let user_apended_flag = false;
    //チャットメンバーに追加された名前一覧取得する
    let menber_names = $('.chat-group-user__name').map(function(index, elem){return $(elem).text();}).get();

    users.forEach(function(user) {
      // チャットメンバーに追加されていないユーザーだけを検索結果に加える
      if ($.inArray(user.name, menber_names) < 0) {
        appendUserToSearchList(user);
        user_apended_flag = true;
      }
    });
    return user_apended_flag;
  }

  $('.chat-group-form__search.clearfix').on('keyup', '#user-search-field', function(e){
    e.preventDefault();
    var input = $.trim($(this).val());
    if ((input.length > 0) && (pre_input != input)) {
      pre_input = input;
      $.ajax({
        url: '/users',
        type: 'GET',
        data: {keyword: input},
        dataType: 'json'
      })

      .done(function(users) {
        resetSearchUserResult();
        if (!((users.length > 0) ? judgeSearchUserResult(users) : false)) {
          noneSearchUserResult();
          }
        })
      .fail(function() {
        alert('ユーザー検索に失敗しました');
      });
    } else if(input.length <= 0) {
      resetSearchUserResult();
    }

    // documentではなく、なるべく近い親要素をレシーバにする
  $('.chat-group-form__field--right').on('click', '.chat-group-user__btn--add', function() {
    var name = $(this).attr("data-user-name");
    var user_id = $(this).attr("data-user-id");
    $(this).parent().remove();
    appendUserToMemberList(name, user_id);
  });

  $('.chat-group-form__field--right').on("click", '.user-search-remove', function() {
    $(this).parent().remove();
  });
  });
});