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


// let loadMoreButton = document.querySelector("#loadMore");
// let offset = 1;
// let limit = 8;



// loadMoreButton.addEventListener("click", async (event) => {
//     const response = await fetch(`http://localhost:8080/api/loadMore?offset=${offset}&&limit=${limit}`);
//     const products = await response.json();

//     products['products'].forEach(product => {
//         let div = document.createElement('div');
//         div.className = "col-lg-4 col-sm-6";
//         div.innerHTML = ejs.render(produtEjs, {
//             product: product
//         });

//         document.querySelector('#top-sell').appendChild(div);
//     });

//     if (products['products'].length == limit)
//         offset += 1;
//     else
//         loadMoreButton.parentElement.style.display = "none";

// });



// function submitForm() {
//     var frm = document.querySelector('#id');
//     frm.submit(); // Submit the form
//     frm.reset(); // Reset all form data
//     return false; // Prevent page refresh
// }

// nút tìm kiếm
(function ($) {
    var offset = 0

    $("#loadMore").click(function (e) {
        offset += 6;
        postFilter(offset)
    })


    $("#findBtn").click(function (e) {
        offset = 0
        $('#top-sell').find('.col-lg-4.col-sm-6').remove();
        postFilter(offset)
    })

    function postFilter(_offset) {
        var data = {
            "productType": [],
            offset: _offset
        }
        $('#select-category input').each(function () {
            if ($(this).is(':checkbox')) {
                if ($(this).is(':checked'))
                    data["productType"].push($(this).val())
            } else {
                data[this.name] = $(this).val();
            }
        })
        $.post("/products", {
            "data": JSON.stringify(data)
        }, function (_data, status) {
            const products = _data["products"]
            if(products.length!=0)
            {
                $("#filter").empty()
                products.forEach(product => {
                    let div = document.createElement('div');
                    div.className = "col-lg-4 col-sm-6";
                    div.innerHTML = ejs.render(produtEjs, {
                        product: product
                    });
                    $(div).insertBefore("#top-sell .text-center.w-100.pt-3");
                });
                if (!_data['more'])
                $("#loadMore").closest("div").css("display", "none");
                else {
                $("#loadMore").closest("div").css("display", "block");
            }
            }
            else
            {
                $("#filter").text("Không có sản phẩm nào")
                $("#loadMore").closest("div").css("display", "none");
            }



        })
    }

})(jQuery);