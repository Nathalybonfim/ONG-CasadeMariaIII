(function(){
  function showFieldError(fieldEl, message){
    var err = fieldEl.parentElement.querySelector('.error');
    if(!err){
      err = document.createElement('div');
      err.className = 'error';
      fieldEl.parentElement.appendChild(err);
    }
    err.textContent = message;
  }
  function clearFieldError(fieldEl){
    var err = fieldEl.parentElement.querySelector('.error');
    if(err) err.remove();
  }

  window.validateVolunteerForm = function(form){
    var ok = true;
    var nome = form.nome;
    var email = form.email;
    var mensagem = form.mensagem;
    clearFieldError(nome); clearFieldError(email); clearFieldError(mensagem);
    if(!nome || nome.value.trim().length < 3){ showFieldError(nome,'Nome completo (mín. 3 caract.)'); ok = false; }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !emailRegex.test(email.value.trim())){ showFieldError(email,'Email inválido'); ok = false; }
    if(!mensagem || mensagem.value.trim().length < 6){ showFieldError(mensagem,'Conte-nos sua motivação (mín. 6 caract.)'); ok = false; }
    return ok;
  };

  window.initVolunteerForm = function(){
    var form = document.getElementById('volunteer-form');
    if(!form) return;
    var newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    newForm.addEventListener('submit', function(e){
      e.preventDefault();
      Array.from(newForm.querySelectorAll('input, textarea, select')).forEach(function(el){ clearFieldError(el); });
      if(!window.validateVolunteerForm(newForm)){
        var firstErr = newForm.querySelector('.error');
        if(firstErr){ var focusEl = firstErr.parentElement.querySelector('input, textarea, select'); if(focusEl) focusEl.focus(); }
        return;
      }
      var cadastro = {
        nome: newForm.nome.value.trim(),
        email: newForm.email.value.trim(),
        telefone: newForm.telefone?newForm.telefone.value.trim():'',
        interesse: newForm.interesse?newForm.interesse.value:'',
        mensagem: newForm.mensagem.value.trim(),
        criadoEm: new Date().toISOString()
      };
      var arr = JSON.parse(localStorage.getItem('cadastros_voluntarios') || '[]');
      arr.push(cadastro);
      localStorage.setItem('cadastros_voluntarios', JSON.stringify(arr));
      showToast('Cadastro recebido. Obrigado!');
      newForm.reset();
    });
  };

  window.initDonationForm = function(){
    var form = document.getElementById('donation-form');
    if(!form) return;
    var newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    newForm.addEventListener('submit', function(e){
      e.preventDefault();
      Array.from(newForm.querySelectorAll('input, textarea, select')).forEach(function(el){ var p = el.parentElement.querySelector('.error'); if(p) p.remove(); });
      var nome = newForm.dnome;
      var valor = newForm.dvalor;
      var tipo = newForm.dtipo;
      var ok = true;
      if(!nome || nome.value.trim().length < 3){ showFieldError(nome,'Nome completo (mín. 3 chars)'); ok = false; }
      var v = parseFloat((valor.value||'').replace(',', '.')) || 0;
      if(v <= 0){ showFieldError(valor,'Insira um valor válido (>0)'); ok = false; }
      if(!tipo || !tipo.value){ showFieldError(tipo,'Selecione o tipo de ajuda'); ok = false; }
      if(!ok) return;
      var chavePix = generatePixKey();
      var donation = { nome: nome.value.trim(), valor: v, tipo: tipo.value, pix: chavePix, criadoEm: new Date().toISOString() };
      var arr = JSON.parse(localStorage.getItem('doacoes') || '[]');
      arr.push(donation);
      localStorage.setItem('doacoes', JSON.stringify(arr));
      showModal('<h3>Chave PIX gerada</h3><p><strong>Chave:</strong> <code>'+chavePix+'</code></p><p><strong>Valor:</strong> R$ '+v.toFixed(2)+'</p><p>Use essa chave no seu app bancário (demo).</p>');
      newForm.reset();
    });
  };

  function generatePixKey(){
    var parts = ['pix','cm','doar','casamaria','solidario'];
    var pick = parts[Math.floor(Math.random()*parts.length)];
    var rand = Math.random().toString(36).slice(2,9);
    return pick+'@'+rand+'.ong';
  }

  window.initTestimonialForm = function(){
    var form = document.getElementById('testimonial-form');
    if(!form) return;
    var newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    newForm.addEventListener('submit', function(e){
      e.preventDefault();
      var nome = newForm.tnome;
      var texto = newForm.ttexto;
      var role = newForm.trole;
      Array.from(newForm.querySelectorAll('input, textarea')).forEach(function(el){ var err = el.parentElement.querySelector('.error'); if(err) err.remove(); });
      var ok = true;
      if(!nome || nome.value.trim().length < 3){ showFieldError(nome,'Nome (min 3 chars)'); ok=false; }
      if(!texto || texto.value.trim().length < 6){ showFieldError(texto,'Escreva a mensagem (min 6 chars)'); ok=false; }
      if(!ok) return;
      var lista = JSON.parse(localStorage.getItem('depoimentos')||'[]');
      lista.unshift({author:nome.value.trim(),text:texto.value.trim(),role:role.value||'',when:new Date().toISOString()});
      localStorage.setItem('depoimentos', JSON.stringify(lista));
      showToast('Depoimento enviado — será exibido em instantes.');
      newForm.reset();
      if(window.renderTestimonials) window.renderTestimonials();
    });
  };

  function showToast(text){
    var box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.right = '20px';
    box.style.bottom = '20px';
    box.style.padding = '12px 16px';
    box.style.background = 'white';
    box.style.borderRadius = '10px';
    box.style.boxShadow = '0 8px 24px rgba(18,30,50,0.12)';
    box.style.zIndex = 9999;
    box.textContent = text;
    document.body.appendChild(box);
    setTimeout(function(){ box.remove(); }, 3800);
  }
  window.showToast = showToast;

  function showModal(html){
    var overlay = document.createElement('div');
    overlay.style.position='fixed'; overlay.style.left=0; overlay.style.top=0; overlay.style.right=0; overlay.style.bottom=0;
    overlay.style.background='rgba(0,0,0,0.35)'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center';
    overlay.style.zIndex=10000;
    var card = document.createElement('div');
    card.style.background='white'; card.style.padding='20px'; card.style.borderRadius='12px'; card.style.maxWidth='480px'; card.style.width='90%';
    card.innerHTML = html + '<div style="text-align:right;margin-top:12px"><button class="btn btn-primary">Fechar</button></div>';
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    card.querySelector('button').addEventListener('click', function(){ overlay.remove(); });
  }

})();
