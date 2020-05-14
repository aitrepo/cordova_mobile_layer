var app = {

    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function () {


        let userPreference = new Set();
        let settingsPage = false;

        // check user has alrday saved his/her preferences

        //alert(settingsPage + "--"+ window.localStorage.getItem("USER_PREF") + (window.localStorage.getItem("USER_PREF") == undefined && window.localStorage.getItem("USER_PREF").length >0))
        if (settingsPage || (window.localStorage.getItem("USER_PREF") == undefined && window.localStorage.getItem("USER_PREF").length > 0)) {
            // NO -> page1 (setup prefernce)

        } else {

            // YES -> page2 (show list of books)
            // $.mobile.navigate("#page2");
            //$.mobile.changePage("list.html", { transition: "slideup" });

            $.mobile.navigate("#page2", {
                allowSamePageTransition: true,
                transition: 'none',
                reloadPage: true
            });

            alert("here")

            // get the saved user preference to an array
            let userPreArray = window.localStorage.getItem("USER_PREF").split(",");
            loadData(userPreArray);
        }

        $("#settingsButton").click(function () {
            let categories = window.localStorage.getItem("USER_PREF").split(",");

            $.mobile.navigate("#page1");
            settingsPage = true;
            categories.forEach(category => {

                if (category != "") {
                    $(`#${category}`).prop("checked", true);
                }
            });
        });


        function mapBookElements(bookObjects) {
            if (bookObjects == undefined) {
                return;
            }

            bookObjects.forEach(book => {
                $('#book_list').append(`
                    <br/>
                    <li class="ui-li-has-thumb"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r">
                    <img src="img/covers/${book.img}">
                    <h2>${book.title}</h2>
                    <p>${book.text}</p>
                    </a></li>`);
            });
        }

        function loadData(categories) {
            // construct the URI from array
            // + categories.toString()
            alert("sercice")

            $.ajax({
                cache: false,
                url: "http://192.168.1.107:3000/booklist/",
                context: document.body
            }).done(function (bookDetails) {
                alert("serice call : " + bookDetails.service)


                $('#book_list').empty()

                categories.forEach(category => {
                    let bookObject = bookDetails.data[category];
                    console.log(bookObject)
                    mapBookElements(bookObject);
                });
            });
        }


        $("input[type=checkbox]").click(function () {

            if (this.checked) {
                // add to the userPreference
                userPreference.add(this.value);
            } else {
                // remove from the userPreference
                userPreference.delete(this.value);
            }

        });


        $("#savePreference").click(function () {
            // save the user pref. to locat storge

            
            let userPreferenceText = "";

            for (let item of userPreference) {
                userPreferenceText = userPreferenceText + "," + item;
            }

            window.localStorage.setItem("USER_PREF", userPreferenceText);

            // Nevigate to list book's page
            //$.mobile.navigate("#page2");
            $.mobile.navigate("#page2", {
                allowSamePageTransition: true,
                transition: 'none',
                reloadPage: true
            });

            //$.mobile.changePage("list.html", { transition: "slideup" });

            let userPreArray = window.localStorage.getItem("USER_PREF").split(",");
            loadData(userPreArray);
            settingsPage = false;
        });


    }

};

app.initialize();