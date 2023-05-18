var Menu = function (){

   var init = function (chaveMenu){
       $("."+chaveMenu).addClass('active');
   }

    return{
        init: function (chaveMenu){
            init(chaveMenu);
        }
    }
}()