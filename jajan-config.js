let items = [
    [1, 'Makanan', 'Makanan 1', 30000],
    [2, 'Makanan', 'Makanan 2', 25000],
    [3, 'Makanan', 'Makanan 3', 25000],
    [4, 'Minuman', 'Minuman 1', 15000],
    [5, 'Minuman', 'Minuman 2', 20000],
    [6, 'Minuman', 'Minuman 3', 20000]
];

function checkItems(id) {
    for (var x=0; x<6; x++){
        if(items[x][0] == id) { return x; }
    }
}

$( document ).ready(function() {
    loadCart();
});

function loadCart() {
    if (localStorage.items) {
        data = JSON.parse(localStorage.getItem('items'));
        for(var x=1; x<=6; x++) {
            var status = 0;
            for (i in data) {
                if (data[i].id_item == x) {
                    $('#qty'+x).html(data[i].qty);
                    $('#remove'+x).html(`<a class="waves-effect waves-light grey darken-3 btn-small" style="padding:0 5px" onClick="removeItem(${data[i].id_item})"><i class="material-icons">remove</i></a>`);
                    status++;
                }
            }

            if (status == 0) {
                $('#qty'+x).html("");
                $('#remove'+x).html("");
            }
        }
    } else {
        for(var x=1; x<=6; x++) {
            $('#qty'+x).html("");
            $('#remove'+x).html("");
        }
    }

    countTotal();
}

function addItem(id) {
    let status = 0;
    let new_qty = 1;
    let key = checkItems(id);
    if (localStorage.items) {
        data = JSON.parse(localStorage.getItem('items'));
        idx_data = 0;
        for (i in data) {
            if (data[i].id_item == id) {
                new_qty = data[i].qty + 1;
                data.push({ 'id_item': data[i].id_item, 'type': data[i].type, 'name': data[i].name, 'price': data[i].price, 'qty': new_qty });
                data.splice(idx_data, 1);
                status++;
            }
            idx_data++;
        }

        if(status == 0){
            data.push({ 'id_item': items[key][0], 'type': items[key][1], 'name': items[key][2], 'price': items[key][3], 'qty': 1 });    
        }
    }else{
        data = [];
        data.push({ 'id_item': items[key][0], 'type': items[key][1], 'name': items[key][2], 'price': items[key][3], 'qty': 1 });
    }

    localStorage.setItem('items', JSON.stringify(data));
    loadCart();
}

function removeItem(id) {
    data = JSON.parse(localStorage.getItem('items'));
    idx_data = 0;
    for (i in data) {
        if (data[i].id_item == id) {
            var new_qty = data[i].qty - 1;
            if(new_qty == 0) {
                data.splice(idx_data, 1);
            }else{   
                data.push({ 'id_item': data[i].id_item, 'type': data[i].type, 'name': data[i].name, 'price': data[i].price, 'qty': new_qty });
                data.splice(idx_data, 1);
            }
        }
        idx_data++;
    }

    localStorage.setItem('items', JSON.stringify(data));
    loadCart();
}

function countTotal() {
    data = JSON.parse(localStorage.getItem('items'));
    let food = 0;
    let drink = 0;
    let price = 0;
    for (i in data) {
        if(data[i].type == "Makanan") { food += data[i].qty; }
        else { drink += data[i].qty; }
        price += (data[i].qty * data[i].price);
    }
    $('#total_food').html(food);
    $('#total_drink').html(drink);
    $('#total_price').html(price);
}