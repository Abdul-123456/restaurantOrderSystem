var main = function() {
    "use strict";

    $(".tabs a").toArray().forEach((element) => {
        $(element).on("click", (event) => {
            event.preventDefault();
            $(".tabs a").removeClass("active");
            $(element).addClass("active");
            $("main .content").empty();

            if ($(element).attr("class")[0] == 'o') {
                console.log("FIRST TAB CLICKED!");
                $.get("/incompleteorders", {}, (response) => {
                    for (let i=0; i<response.length; i++) {
                        var className = "" + response[i]["id"];
                        var taskDiv = $("<div>");
                        taskDiv.attr("id", "task");
                        taskDiv.addClass(className);
                        taskDiv.text(response[i].quantity + " " + response[i]["itemName"] + " (" + response[i].type + ")");

                        var cmpBtn = $("<button>");
                        cmpBtn.attr("id", "cmpltBtn");
                        cmpBtn.attr("title", "Mark Completed");
                        cmpBtn.append("&#10003;");

                        cmpBtn.on("click", () => {
                            $.post("/completeorder", {orderId: response[i]["id"]}, (res) => {
                                $(element).click();
                            });
                        });

                        taskDiv.append(cmpBtn);

                        $("main .content").append(taskDiv);
                    }
                });
            }
            else if ($(element).attr("class")[0] == 'a') {
                $("main .content").empty();
                console.log("SECOND TAB CLICKED!");

                var tables = [
                    "Table 1",
                    "Table 2",
                    "Table 3",
                    "Table 4A",
                    "Table 4B",
                    "Table 5",
                    "Table 6",
                    "Table 7",
                    "Table 8",
                    "Table 9",
                    "Table 10",
                    "Table 11",
                    "Table 12",
                    "Table 13",
                    "Table 14",
                    "Table 15",
                    "To Go"
                ];

                var div = $("<div>");
                div.attr("class", "addSection");

                div.append("<p>Please select order type:</p>")
                for (let i=0; i<tables.length; i++) {
                    div.append("<input name=\"orderType\" type=\"radio\" id=\"" + (tables[i].toLowerCase()).replaceAll(" ", "") + "\"><label for=\"" + (tables[i].toLowerCase()).replaceAll(" ", "") + "\">" + tables[i] + "</label><br>");
                }

                div.append("<br><br>");

                div.append("<p>Please select item:</p>")
                $.get("/items", {}, (response) => {
                    for (let i=0; i<response.length; i++) {
                        div.append("<input type=\"checkbox\" id=\"item" + i + "\"><label for=\"item" + i + "\">" + response[i].name + "</label><input type=\"number\" id=\"quantity" + i + "\"><br>");
                    }

                    var addBtn = $("<button>");
                    addBtn.text("Add Order");

                    addBtn.on("click", () => {
                        var type;
                        var quantity;
                        var itemId;
                        // console.log($(type).is(":checked"));

                        for (var i=0; i<tables.length; i++) {
                            var tableId = "#" + (tables[i].toLowerCase()).replaceAll(" ", "");
                            if ($(tableId).is(":checked")) {
                                type = tables[i];
                                // quantity = $(tableId).val();
                            }
                        }

                        for (var j=0; j<response.length; j++) {
                            var item = "#item" + j;
                            if ($(item).is(":checked")) {
                                itemId = response[j].id;
                                quantity = $("#quantity"+j).val();
                                $.post("/neworder", {"type":type, "itemId":itemId, "quantity":quantity}, (res) => {});
                            }

                            if (j==response.length-1) {
                                $(element).click();
                            }
                        }

                        
                    });

                    div.append("<br>");
                    div.append(addBtn);

                    $("main .content").append(div);
                });
            }
        });
    });
};

$(document).ready(main);

