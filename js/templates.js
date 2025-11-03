(function(){
  function escapeHtml(str){ return String(str||'').replace(/"/g,'&quot;').replace(/'/g,"&#39;"); }

  window.createCard = function(title, description, img){
    var imageTag = img ? '<img src="'+img+'" alt="'+escapeHtml(title)+'">' : '<div style="height:120px;border-radius:8px;background:linear-gradient(90deg,#eef7ee,#fff);"></div>';
    return '\
      <article class="card" role="article">\
        '+imageTag+'\
        <h3>'+escapeHtml(title)+'</h3>\
        <p>'+escapeHtml(description)+'</p>\
        <div class="actions">\
          <button class="btn btn-primary" data-action="donate" data-title="'+escapeHtml(title)+'">Apoiar</button>\
          <button class="btn btn-outline" data-action="details" data-title="'+escapeHtml(title)+'">Saiba mais</button>\
        </div>\
      </article>';
  };

  window.createTestimonial = function(author, text, role){
    return '\
      <div class="testimonial" role="group" aria-label="Depoimento de '+escapeHtml(author)+'">\
        <strong>'+escapeHtml(author)+'</strong>\
        '+(role?('<div class="small">'+escapeHtml(role)+'</div>'):'')+'\
        <p>'+escapeHtml(text)+'</p>\
      </div>';
  };
})();
