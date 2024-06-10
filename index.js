document.getElementById("button-random-dog").addEventListener("click", () => handleFetchDogPicUrl('random'));
document.getElementById("button-show-breed").addEventListener("click", () => handleFetchDogPicUrl('breed'));
document.getElementById("button-show-sub-breed").addEventListener("click", handleFetchSubBreedList);
document.getElementById("button-show-all").addEventListener("click", handleFetchAllBreedsList);

const contentDiv = document.getElementById("content");
const errorText = document.createElement("p");

async function handleFetchDogPicUrl(type) {
    try {
        event.preventDefault();
        let url;
        switch (type) {
            case 'random':
                url = "https://dog.ceo/api/breeds/image/random";
                break;
            case 'breed':
                const breed = document.getElementById("input-breed").value.trim().toLowerCase();
                url = `https://dog.ceo/api/breed/${breed}/images/random`;
                break;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "success" && data.message) {
            const picUrl = data.message;
            const imgElement = document.getElementById("dogPic");
            if (imgElement) {
                imgElement.src = picUrl;
            } else {
                contentDiv.innerHTML = '';
                const newImgElement = document.createElement("img");
                newImgElement.id = "dogPic"
                newImgElement.src = picUrl;
                newImgElement.alt = "Picture of a dog";
                contentDiv.appendChild(newImgElement);
            }
        } else if (data.status === "error" && data.code === 404) {
            handleGenericError(data.code, data.message);
        }
    } catch (e) {
        console.error(e);
    }
}

async function handleFetchSubBreedList() {
    try {
        event.preventDefault();
        const subBreed = document.getElementById("input-breed").value.trim().toLowerCase();
        const url = `https://dog.ceo/api/breed/${subBreed}/list`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'success' && data.message.length > 0) {
            const subBreedList = document.createElement("ol");
            for (let item of data.message) {
                const subBreedItem = document.createElement("li");
                subBreedItem.textContent = item;
                subBreedList.appendChild(subBreedItem);
            }
            contentDiv.innerHTML = '';
            contentDiv.appendChild(subBreedList);
        } else if (data.status === 'success' && data.message.length === 0) {
            errorText.innerText = "No sub-breeds found!";
            document.getElementById("content").innerHTML = '';
            document.getElementById("content").appendChild(errorText);
        } else if (data.status === "error" && data.code === 404) {
            handleGenericError(data.code, data.message);
        }
    } catch (e) {
        console.error(e);
    }
}

async function handleFetchAllBreedsList() {
    try {
        event.preventDefault();
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();
        if (data.status === 'success') {
            const allBreedsList = document.createElement("ol");
            // Iterate through breeds
            for (let breed in data.message) {
                const breedItem = document.createElement("li");
                breedItem.innerText = breed;
                // Iterate through sub-breeds if there is
                if (data.message[breed].length > 0) {
                    const subBreedsList = document.createElement("ul");
                    for (let subBreed of data.message[breed]) {
                        const subBreedItem = document.createElement("li");
                        subBreedItem.innerText = subBreed;
                        subBreedsList.appendChild(subBreedItem);
                    }
                    breedItem.appendChild(subBreedsList);
                }
                allBreedsList.appendChild(breedItem);
            }
            contentDiv.innerHTML = '';
            contentDiv.appendChild(allBreedsList);
        }
    } catch (e) {
        console.error(e);
    }
}

function handleGenericError(errorCode, errorMsg) {
    console.error(errorMsg);
    switch (errorCode) {
        case 404:
            errorText.innerText = "Breed not found!";
            document.getElementById("content").innerHTML = '';
            document.getElementById("content").appendChild(errorText);
            break;
    }
}