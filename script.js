let notes = [];

async function fetchNotes() {
  try {
    const response = await fetch("https://student-notes-backend.onrender.com/api/notes");
    notes = await response.json();
    displayNotes(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    container.innerHTML = "<p>Failed to load notes. Please try again later.</p>";
  }
}

const container = document.getElementById('notesContainer');
const searchInput = document.getElementById('searchInput');
const subjectSelect = document.getElementById('subjectSelect');
const sortSelect = document.getElementById('sortSelect');

function displayNotes(filteredNotes) {
  container.innerHTML = '';

  if (filteredNotes.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>📝 No study notes found matching your criteria</p>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }

  // Study-themed icons for different subjects
  const subjectIcons = {
    'ECE': '⚡',
    'IT': '💻',
    'CSE': '🖥️',
    'ME': '⚙️',
    'Maths': '🔢',
    'default': '📚'
  };

  // Study-themed colors for different subjects
  const subjectColors = {
    'ECE': ['#4776E6', '#8E54E9'],
    'IT': ['#11998e', '#38ef7d'],
    'CSE': ['#FF8008', '#FFC837'],
    'ME': ['#F953C6', '#B91D73'],
    'Maths': ['#3498db', '#2980b9'],
    'default': ['#4776E6', '#8E54E9']
  };

  filteredNotes.forEach((note, index) => {
    // 🔧 TEMP MOCK SUBTOPICS BASED ON TITLE
    const mockSubtopics = {
      "Computer Networks": ["OSI Model", "TCP/IP", "Routing Protocols"],
      "Data Structures": ["Arrays", "Linked Lists", "Stacks", "Queues"],
      "Digital Electronics": ["Logic Gates", "Flip-Flops", "Multiplexers"],
      "Operating Systems": ["Processes", "Memory Management", "Deadlock"],
      "Database Management": ["SQL Queries", "Normalization", "ER Diagrams"]
    };

    const subtopics = mockSubtopics[note.title] || [];
    const icon = subjectIcons[note.subject] || subjectIcons.default;
    const colors = subjectColors[note.subject] || subjectColors.default;

    const noteCard = document.createElement('div');
    noteCard.className = 'noteCard';
    noteCard.style.animationDelay = `${index * 0.05}s`;
    
    // Apply custom color to the card's top border
    noteCard.style.setProperty('--card-gradient', `linear-gradient(to right, ${colors[0]}, ${colors[1]})`);

    const subtopicsHTML = subtopics.length
      ? `<ul class="subtopics hidden">${subtopics.map(sub => `<li>${sub}</li>`).join('')}</ul>`
      : `<p class="no-subtopics hidden">No subtopics available.</p>`;

    noteCard.innerHTML = `
      <div class="card-header">
        <span class="subject-icon">${icon}</span>
        <span class="subject-label">${note.subject || 'General'}</span>
      </div>
      <h3>${note.title}</h3>
      <p>${note.content.substring(0, 120)}...</p>
      <div class="card-footer">
        <span class="expand-btn">View Topics</span>
      </div>
      ${subtopicsHTML}
    `;

    noteCard.querySelector('.expand-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const subtopicList = noteCard.querySelector('.subtopics') || noteCard.querySelector('.no-subtopics');
      const expandBtn = noteCard.querySelector('.expand-btn');
      
      // Close all other open subtopic lists first
      document.querySelectorAll('.subtopics:not(.hidden), .no-subtopics:not(.hidden)').forEach(list => {
        if (list !== subtopicList) {
          list.classList.add('hidden');
          const card = list.closest('.noteCard');
          if (card) {
            card.querySelector('.expand-btn').textContent = 'View Topics';
          }
        }
      });
      
      if (subtopicList) {
        subtopicList.classList.toggle('hidden');
        expandBtn.textContent = subtopicList.classList.contains('hidden') ? 'View Topics' : 'Hide Topics';
      }
    });

    noteCard.addEventListener('click', () => {
      // Show popup with full note content
      const popup = document.getElementById('notePopup');
      const popupTitle = document.getElementById('popupTitle');
      const popupSubject = document.getElementById('popupSubject');
      const popupContent = document.getElementById('popupContent');
      
      popupTitle.textContent = note.title;
      popupSubject.textContent = `${icon} ${note.subject || 'General'}`;
      popupContent.textContent = note.content;
      
      popup.classList.remove('hidden');
    });

    container.appendChild(noteCard);
  });
  
  // Close popup when clicking the close button or outside the popup
  document.getElementById('popupClose').addEventListener('click', () => {
    document.getElementById('notePopup').classList.add('hidden');
  });
  
  document.getElementById('notePopup').addEventListener('click', (e) => {
    if (e.target === document.getElementById('notePopup')) {
      document.getElementById('notePopup').classList.add('hidden');
    }
  });
}

function filterNotes() {
  const searchText = searchInput.value.toLowerCase();
  const selectedSubject = subjectSelect.value;
  const sortBy = sortSelect.value;

  // Filter notes
  let filtered = notes.filter(note =>
    (note.title.toLowerCase().includes(searchText) || note.content.toLowerCase().includes(searchText)) &&
    (selectedSubject === 'All' || note.subject === selectedSubject)
  );

  // Sort notes
  filtered = sortNotes(filtered, sortBy);

  // Display with animation
  container.classList.add('animating');
  setTimeout(() => {
    displayNotes(filtered);
    container.classList.remove('animating');
  }, 300);
}

function sortNotes(notesToSort, sortBy) {
  switch(sortBy) {
    case 'newest':
      return [...notesToSort].sort((a, b) => new Date(b.date || Date.now()) - new Date(a.date || Date.now()));
    case 'oldest':
      return [...notesToSort].sort((a, b) => new Date(a.date || Date.now()) - new Date(b.date || Date.now()));
    case 'az':
      return [...notesToSort].sort((a, b) => a.title.localeCompare(b.title));
    case 'za':
      return [...notesToSort].sort((a, b) => b.title.localeCompare(a.title));
    default:
      return notesToSort;
  }
}

searchInput.addEventListener('input', filterNotes);
subjectSelect.addEventListener('change', filterNotes);
sortSelect.addEventListener('change', filterNotes);

// Add animation class for container
const animateCSS = `
@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animating .noteCard {
  animation: cardEntrance 0.5s ease-out forwards;
}
`;

// Add the animation styles
const styleElement = document.createElement('style');
styleElement.textContent = animateCSS;
document.head.appendChild(styleElement);

// Initialize with animation
document.addEventListener('DOMContentLoaded', () => {
  // Add a subtle loading animation
  container.innerHTML = '<div class="loading">📚 Loading study notes...</div>';
  fetchNotes();
});

