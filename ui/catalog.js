// Project Path Assignment : MongoDB & Webapps
// Catalog UI JavaSctipt
// Nate Arkin

window.onload = function () {
    // fetch products and display them here
    drawCatalog();
}

async function drawCatalog() {
    const apiCall = await fetch('/api/getProducts')
        .then(result => result.json())
        .then(result => { return result })
    if (apiCall.success) {
        // Do the things for each product
        apiCall.data.forEach(product => {
            const container = document.createElement('div');
            container.classList.add('productContainer');

            const image = document.createElement('img');
            image.src = product.productImageURL;
            container.appendChild(image);
            container.appendChild(document.createElement('br'));

            const name = document.createElement('span');
            name.classList.add('productTitle');
            name.innerText = product.productName;
            container.appendChild(name);
            container.appendChild(document.createElement('br'));

            const price = document.createElement('span');
            price.classList.add('productPrice');
            price.innerText = `$${product.productUnitPrice}`;
            container.appendChild(price);
            container.appendChild(document.createElement('br'));

            const stock = document.createElement('span');
            stock.classList.add('productStock');
            stock.innerText = `Qty In Stock: ${product.productInventory}`;
            container.appendChild(stock);
            container.appendChild(document.createElement('br'));

            const description = document.createElement('span');
            description.classList.add('productDescription');
            description.innerText = product.productDescription;
            container.appendChild(description);
            container.appendChild(document.createElement('br'));

            const cartButton = document.createElement('button');
            cartButton.innerText = 'Add to Cart';
            cartButton.addEventListener('click', function () {
                addToCart(product._id, product.productInventory);
            })
            if (product.productInventory === 0) {
                cartButton.disabled = true;
                cartButton.innerText = 'Out of Stock';

            }
            container.appendChild(cartButton);

            document.getElementById('catalogContainer').appendChild(container);
        })
    } else {
        alert(`An error has occured: \n\n ${JSON.stringify(apiCall.err)}`);
        console.error(apiCall.err);
    }
}

/**
 * Adds an item to the users session cart
 * @param {string} uid - The uid of the item being added to the cart
 * @param {number} onHandQty - The quantity on hand of the item being added to the cart
 */
function addToCart(uid, onHandQty) {
    var cart = [];
    if (window.sessionStorage.cart) {
        cart = JSON.parse(window.sessionStorage.cart);
        const itemRecord = cart.filter(item => item.id === uid)[0]
        if (itemRecord === undefined) {
            cart.push({ id: uid, qty: 1 });
        } else {
            if (itemRecord.qty === onHandQty) {
                alert("Qty on hand matches qty in cart. Can't add any more pieces")
            } else {
                itemRecord.qty++;
            }
        }
    } else {
        cart.push({ id: uid, qty: 1 });
    }

    window.sessionStorage.setItem('cart', JSON.stringify(cart));
}