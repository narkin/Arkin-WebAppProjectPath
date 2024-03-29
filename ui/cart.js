// Project Path Assignment : MongoDB & Webapps
// Catalog UI JavaSctipt
// Nate Arkin

const orderRecord = [];

window.onload = async function () {
    if (window.sessionStorage.userID) {
        const userLogin = await fetch('authUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userID: window.sessionStorage.userID
            })
        })
            .then(response => response.json())
            .then(result => { return result });
        if (userLogin.success) {
            drawCart();
        } else {
            window.sessionStorage.removeItem('userID');
            alert(userLogin.err)
            window.location.href = '/login';
        }
    } else {
        window.sessionStorage.removeItem('userID');
        window.location.href = '/login';
    }
}

async function drawCart() {
    const apiCall = await fetch('/api/getProducts')
        .then(result => result.json())
        .then(result => { return result })
    if (apiCall.success) {
        const cart = JSON.parse(window.sessionStorage.cart);
        apiCall.data.filter(product => cart.map(product => product.id).includes(product._id)).forEach(product => {
            const orderRecordLine = {};
            const cartData = cart.filter(cartProduct => cartProduct.id === product._id)[0]
            const container = document.createElement('div');
            container.classList.add('productContainer');

            orderRecordLine.id = product._id;

            const image = document.createElement('img');
            image.src = product.productImageURL;
            container.appendChild(image);
            container.appendChild(document.createElement('br'));

            const name = document.createElement('span');
            name.classList.add('productTitle');
            name.innerText = product.productName;
            container.appendChild(name);
            container.appendChild(document.createElement('br'));
            orderRecordLine.name = product.productName;

            const price = document.createElement('span');
            price.classList.add('productPrice');
            price.innerText = `$${product.productUnitPrice}`;
            container.appendChild(price);
            container.appendChild(document.createElement('br'));
            orderRecordLine.unitPrice = product.productUnitPrice;

            const stock = document.createElement('span');
            stock.classList.add('productStock');
            stock.innerText = `Qty In Cart: ${cartData.qty}`;
            container.appendChild(stock);
            container.appendChild(document.createElement('br'));
            orderRecordLine.qtyPurchased = cartData.qty;

            const description = document.createElement('span');
            description.classList.add('productDescription');
            description.innerText = product.productDescription;
            container.appendChild(description);
            container.appendChild(document.createElement('br'));

            const cartButton = document.createElement('button');
            cartButton.innerText = 'Remove one from Cart';
            cartButton.addEventListener('click', function () {
                removeFromCart(product._id);
            })
            container.appendChild(cartButton);

            document.getElementById('cartContainer').appendChild(container);

            orderRecord.push(orderRecordLine);
        })
    }
}

function removeFromCart(uid) {
    const cart = JSON.parse(window.sessionStorage.cart);
    const itemRecord = cart.filter(line => line.id === uid)[0];

    if (itemRecord.qty > 1) {
        itemRecord.qty--;
        window.sessionStorage.setItem('cart', JSON.stringify(cart));
    } else {
        window.sessionStorage.setItem('cart', JSON.stringify(cart.filter(product => product.id != uid)))
    }

    window.location.reload();
}

async function checkout() {
    const cartUpdated = [];
    const cart = JSON.parse(window.sessionStorage.cart);
    const apiCall = await fetch('/api/getProducts')
        .then(result => result.json())
        .then(result => { return result })
    cart.forEach(cartLine => {
        const apiLine = apiCall.data.filter(product => product._id === cartLine.id)[0];
        if (apiLine.productInventory < cartLine.qty) {
            cartUpdated.push(apiLine.productName);
            if (apiLine.productInventory === 0) {
                window.sessionStorage.setItem('cart', JSON.stringify(cart.filter(product => product.id != cartLine.id)));
            } else {
                cartLine.qty = apiLine.productInventory;
                window.sessionStorage.setItem('cart', JSON.stringify(cart));
            }
        }
    })

    if (cartUpdated.length != 0) {
        var updates = '';
        cartUpdated.forEach(line => {
            updates += `${line}\n`;
        })
        alert(`Some on hand quantities are less than your cart quantities. The following items have been updated in your cart
        \n${updates}`);
        window.location.reload();
        return 0;
    } else {
        const stockUpdate = await fetch('/api/updateOnHand', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                items: JSON.parse(window.sessionStorage.cart)
            })
        })
            .then(result => result.json())
            .then(result => { return result })

        // record order to user's order history
        // {userID, date, order: [productName, unitCost, qty]}
        await fetch('/api/order', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userID: window.sessionStorage.userID,
                orderInformation: orderRecord
            })
        })


        if (stockUpdate.success) {
            alert('success!')
            window.sessionStorage.removeItem('cart');
            window.location.href = '/';
        }
    }
}