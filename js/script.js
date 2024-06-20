const bukus = [];
const RENDER_EVENT = 'render-read';


function generateId() {
    return +new Date();
}

function generateReadObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedReadList = document.getElementById('bukus');
    uncompletedReadList.innerHTML = '';

    const completedReadList = document.getElementById('completed-bukus');
    completedReadList.innerHTML = '';

    for (const buku of bukus) {
        const readElement = makeRead(buku);
        if (!buku.isCompleted)
            uncompletedReadList.append(readElement);
        else
            completedReadList.append(readElement);
    }
});



document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addRead();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function makeRead(readObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = readObject.title;

    const textAuthor = document.createElement('h3');
    textAuthor.innerText = readObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = readObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `read-${readObject.id}`);

    if (readObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(readObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(readObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addTaskToCompleted(readObject.id);
        });

        container.append(checkButton);
    }

    return container;
}

function addRead() {
    const textTitle = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const textYear = document.getElementById('year').value;

    const generatedID = generateId();
    const readObject = generateReadObject(generatedID, textTitle, textAuthor, textYear, false);
    bukus.push(readObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('Hore!Buku Baru Telah Ditambahkan ke dalam list!');
}

function addTaskToCompleted(readId) {
    const readTarget = findRead(readId);

    if (readTarget == null) return;

    readTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('Yeay! Buku Telah Selesai Dibaca!');
}

function findRead(readId) {
    for (const buku of bukus) {
        if (buku.id === readId) {
            return buku;
        }
    }
    return null;
}

function removeTaskFromCompleted(readId) {
    const readTarget = findReadIndex(readId);

    if (readTarget === -1) return;

    const confirmation = confirm('Kamu yakin akan menghapus data buku ini?');
    if (!confirmation) return;

    bukus.splice(readTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('Data Buku Berhasil Dihapus!');
}

function undoTaskFromCompleted(readId) {
    const readTarget = findRead(readId);

    if (readTarget == null) return;

    readTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('Hore! Data Berhasil Dikembalikan!');
}

function findReadIndex(readId) {
    for (const index in bukus) {
        if (bukus[index].id === readId) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bukus);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-read';
const STORAGE_KEY = 'READ_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Yahh, browsernya ga support Web Storage :(');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));

});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const read of data) {
            bukus.push(read);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));


}