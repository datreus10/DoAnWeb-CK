let loadMoreButton = document.querySelector("#loadMore");
let offset = 1;
let limit = 8;


const produtEjs = `<div class="product-item">
<div class="pi-pic">
    <img src='./img/upload/<%= product.img[0] %>' alt="">
    <div class="pi-links">
        <a href="#" class="add-card"><i class="flaticon-bag"></i><span>ADD TO CART</span></a>
        <a href="#" class="wishlist-btn"><i class="flaticon-heart"></i></a>
    </div>
</div>
<div class="pi-text">
    <h6><%= product.price %>đ</h6>
    <p><%= product.name %> </p>
</div>
</div>`;

loadMoreButton.addEventListener("click", async () => {
    const response = await fetch(`http://localhost:8080/index/loadMore?offset=${offset}&&limit=${limit}`);
    const products = await response.json();

    products['products'].forEach(product => {
        let div = document.createElement('div');
        div.className = "col-lg-3 col-sm-6";
        div.innerHTML = ejs.render(produtEjs, {
            product: product
        });
        document.querySelector('#top-sell').appendChild(div);
    });

    if (products['products'].length == limit)
        offset += 1;
    else
        loadMoreButton.style.visibility = "hidden";

});

function submitForm() {
    var frm = document.querySelector('#id');
    frm.submit(); // Submit the form
    frm.reset();  // Reset all form data
    return false; // Prevent page refresh
 }