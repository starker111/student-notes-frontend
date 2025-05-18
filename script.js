const notes = [
  { title: "Algebra Basics", subject: "Math", content: "Key formulas for algebra..." },
  { title: "Newton's Laws", subject: "Physics", content: "3 laws of motion explained..." },
  { title: "JavaScript Loops", subject: "CS", content: "for, while, and do-while explained..." },
  { title: "Derivatives", subject: "Math", content: "Definition, rules, and examples..." },
];

const container = document.getElementById('notesContainer');
const searchInput = document.getElementById('searchInput');
const subjectSelect = document.getElementById('subjectSelect');

function displayNotes(filteredNotes) {
  container.innerHTML = '';
  filteredNotes.forEach(note => {
    const noteCard = document.createElement('div');
    noteCard.className = 'noteCard';
    noteCard.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
    container.appendChild(noteCard);
  });
}

function filterNotes() {
  const searchText = searchInput.value.toLowerCase();
  const selectedSubject = subjectSelect.value;

  const filtered = notes.filter(note =>
    (note.title.toLowerCase().includes(searchText) || note.content.toLowerCase().includes(searchText)) &&
    (selectedSubject === 'All' || note.subject === selectedSubject)
  );

  displayNotes(filtered);
}

searchInput.addEventListener('input', filterNotes);
subjectSelect.addEventListener('change', filterNotes);

// Initial render
displayNotes(notes);
