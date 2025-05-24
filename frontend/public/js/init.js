(function($){
  $(function(){

    // Initialize Materialize components
    $('.sidenav').sidenav();
    $('select').formSelect();
    $('.tabs').tabs();

    // Carregamento dinâmico de partes da página
    $("#header").load("/partials/header");
    $("#footer").load("/partials/footer");
    $("#loading").load("/partials/loading");

  }); // end of document ready

})(jQuery); // end of jQuery name space
