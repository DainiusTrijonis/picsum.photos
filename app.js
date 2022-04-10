window.addEventListener('load', loadImages);

let page = 1
let hasMore = true

const image = document.getElementById('img')
const author = document.getElementById('author')
const width = document.getElementById('width')
const height = document.getElementById('height')

const imageFooter = document.getElementById('rightColFooter')
const imgListDiv = document.getElementById('imgList')

const nextPageButton = document.getElementById('nextPage')
const previousPageButton = document.getElementById('previousPage')
const currentPageButton = document.getElementById('currentPage')

let imgList = []

let focusImage = null

const grayscaleCheck = document.getElementById('grayscale')
grayscale.addEventListener('change', (event) => {
    if(event.currentTarget.checked) {
        params.set('grayscale','')
    } else {
        params.delete('grayscale')
    }
    loadImage()
})

const blurRange = document.getElementById('blur')
blurRange.addEventListener('change', (event) => {
    params.set('blur',event.currentTarget.value)
    loadImage()
})

let params = new URLSearchParams({'blur':1})
function loadImage() {
    const urlUpdated = focusImage.download_url +'?'+ (params)
    fetch(urlUpdated)
        .then(res => {
            image.src = res.url
        })
        .catch((e) => console.log(e))
    author.innerText = focusImage.author
    width.innerText = focusImage.width
    height.innerText = focusImage.height
}

function loadImages() {
    fetch(`https://picsum.photos/v2/list?page=${page}&limit=10`)
        .then(response => {
            response.headers.get("Link").indexOf('rel="next') >= 0 ? hasMore = true : hasMore = false
            nextPageButton.hidden = !hasMore
            return response.json()
        })
        .then(res => {
            imgList = res
            res.forEach(element => {
                let iDiv = document.createElement('div',{})
                iDiv.id = element.id
                iDiv.className = "listItem"
                iDiv.onclick = () => {
                    focusImage = element
                    loadImage()
                    imageFooter.hidden = false 
                }
                let img = document.createElement('img')
                img.id = element.id
                img.className = "image"
                img.src = element.download_url
                iDiv.appendChild(img)
                imgListDiv.appendChild(iDiv)
            });
            listFooter = document.createElement('div')
            listFooter.id = "listFooter"
            imgListDiv.appendChild(listFooter)
            let options = {
                root: null,
                rootMargins: "0px",
                threshold: 0.5,
            }
            const observer = new IntersectionObserver(handleIntersect, options)
            observer.observe(document.getElementById("listFooter"))
        })
}

function handleIntersect(entries) {
    if (entries[0].isIntersecting) {
        console.log("Fetch more data")
        document.getElementById("listFooter").remove();
        if(hasMore) {
            page++
            currentPageButton.innerText = page
            previousPageButton.hidden = false
            loadImages()
        }
    }
}

function previousPage() {
    if(page == 1) {
        previousPageButton.hidden = true;
    } else {
        page--
        currentPageButton.innerText = page
        if (page == 1) {
            previousPageButton.hidden = true
        }
        imgListDiv.innerHTML = ""
        loadImages()
    }
}
function nextPage() {
    if(hasMore) {
        page++
        currentPageButton.innerText = page
        previousPageButton.hidden = false
        imgListDiv.innerHTML = ""
        loadImages()
    } else {
        nextPageButton.hidden = true
    }
}