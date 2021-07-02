const produtEjs = `<div class="product-item" id="<%= product._id %>" onclick="location.href='/product/<%= product._id %>';"
style="cursor:pointer">
<div class="pi-pic">
    <img src='<%= product.fileLinks[0] %>' height="410px" alt="">
    <div class="pi-links">
        <a href="#" class="add-card"><i class="flaticon-bag"></i><span>Thêm vào giỏ hàng</span></a>
        <a href="#" class="wishlist-btn"><i class="flaticon-heart"></i></a>
    </div>
</div>
<div class="pi-text">
    <p><%= product.name %> </p>
    <h6><%= product.priceFormat %></h6>   
</div>
</div>`;


let loadMoreButton = document.querySelector("#loadMore");
let offset = 1;
let limit = 8;



loadMoreButton.addEventListener("click", async (event) => {
    const response = await fetch(`http://localhost:8080/api/loadMore?offset=${offset}&&limit=${limit}`);
    const products = await response.json();

    products['products'].forEach(product => {
        let div = document.createElement('div');
        div.className = "col-lg-4 col-sm-6";
        div.innerHTML = ejs.render(produtEjs, {
            product: product
        });
        
        document.querySelector('#top-sell').appendChild(div);
    });

    if (products['products'].length == limit)
        offset += 1;
    else
        loadMoreButton.parentElement.style.display="none";

});



function submitForm() {
    var frm = document.querySelector('#id');
    frm.submit(); // Submit the form
    frm.reset(); // Reset all form data
    return false; // Prevent page refresh
}