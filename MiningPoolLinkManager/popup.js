document.addEventListener('DOMContentLoaded', function() {
  const linkList = document.getElementById('linkList');
  const addLinkForm = document.getElementById('addLinkForm');
  const linkName = document.getElementById('linkName');
  const linkUrl = document.getElementById('linkUrl');

  // Load existing links
  chrome.storage.sync.get(['links'], function(result) {
    const links = result.links || [];
    renderLinks(links);
  });

  // Add new link
  addLinkForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = linkName.value.trim();
    const url = linkUrl.value.trim();
    
    if (name && url) {
      chrome.storage.sync.get(['links'], function(result) {
        const links = result.links || [];
        links.push({ name, url });
        chrome.storage.sync.set({ links: links }, function() {
          renderLinks(links);
          linkName.value = '';
          linkUrl.value = '';
        });
      });
    }
  });

  // Render links
  function renderLinks(links) {
    linkList.innerHTML = '';
    links.forEach(function(link, index) {
      const linkElement = document.createElement('div');
      linkElement.className = 'link-item';
      linkElement.innerHTML = `
        <span>${link.name}</span>
        <button class="open-link">Open</button>
        <button class="delete-link">Delete</button>
      `;
      
      linkElement.querySelector('.open-link').addEventListener('click', function() {
        chrome.tabs.create({ url: link.url });
      });
      
      linkElement.querySelector('.delete-link').addEventListener('click', function() {
        links.splice(index, 1);
        chrome.storage.sync.set({ links: links }, function() {
          renderLinks(links);
        });
      });
      
      linkList.appendChild(linkElement);
    });
  }
});