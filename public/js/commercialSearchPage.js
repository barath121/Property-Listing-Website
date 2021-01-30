function pages(page){
    var re = /\s*(?:&|=)\s*/
    var locArr = location.href.split(re);
    console.log(locArr)
    if(locArr.includes("page")){
        var lastEle = locArr[locArr.length -1]
        window.location.href = location.href.replace("page="+lastEle,"page="+page);
    }else{
        if(locArr[0] == location.href){
            window.location.href = location.href+"?"+"page="+page;
        }
        else{
            window.location.href = location.href+"&"+"page="+page;
        }
    }
}
function sale(){
    if(document.getElementById("sale").classList.contains("d-none")){
        document.getElementById("sale").classList.remove("d-none")
    }
    else if(!document.getElementById("sale").classList.contains("d-none")){
        document.getElementById("sale").classList.add("d-none")
    }

    if(document.getElementById("saleBudget").classList.contains("d-none")){
        document.getElementById("saleBudget").classList.remove("d-none")
    }
    else if(!document.getElementById("saleBudget").classList.contains("d-none")){
        document.getElementById("saleBudget").classList.add("d-none")
    }

    if(document.getElementById("rentBudget").classList.contains("d-none")){
        document.getElementById("rentBudget").classList.remove("d-none")
    }
    else if(!document.getElementById("rentBudget").classList.contains("d-none")){
        document.getElementById("rentBudget").classList.add("d-none")
    }
}

function rent(){
    if(!document.getElementById("sale").classList.contains("d-none")){
        document.getElementById("sale").classList.add("d-none")
    }

    if(document.getElementById("saleBudget").classList.contains("d-none")){
        document.getElementById("saleBudget").classList.remove("d-none")
    }
    else if(!document.getElementById("saleBudget").classList.contains("d-none")){
        document.getElementById("saleBudget").classList.add("d-none")
    }

    if(document.getElementById("rentBudget").classList.contains("d-none")){
        document.getElementById("rentBudget").classList.remove("d-none")
    }
    else if(!document.getElementById("rentBudget").classList.contains("d-none")){
        document.getElementById("rentBudget").classList.add("d-none")
    }
}

function mobsale(){
    console.log("hello2")
    if(document.getElementById("mobsale").classList.contains("d-none")){
        document.getElementById("mobsale").classList.remove("d-none")
    }
    else if(!document.getElementById("mobsale").classList.contains("d-none")){
        document.getElementById("mobsale").classList.add("d-none")
    }

    if(document.getElementById("mobSaleBudget").classList.contains("d-none")){
        document.getElementById("mobSaleBudget").classList.remove("d-none")
    }
    else if(!document.getElementById("mobSaleBudget").classList.contains("d-none")){
        document.getElementById("mobSaleBudget").classList.add("d-none")
    }

    if(document.getElementById("mobRentBudget").classList.contains("d-none")){
        document.getElementById("mobRentBudget").classList.remove("d-none")
    }
    else if(!document.getElementById("mobRentBudget").classList.contains("d-none")){
        document.getElementById("mobRentBudget").classList.add("d-none")
    }
}
function mobrent(){
    console.log("hello")
    if(!document.getElementById("mobsale").classList.contains("d-none")){
        document.getElementById("mobsale").classList.add("d-none")
    }
    // if(document.getElementById("mobSaleBudget").classList.contains("d-none")){
    //     document.getElementById("mobSaleBudget").classList.remove("d-none")
    // }
    if(!document.getElementById("mobSaleBudget").classList.contains("d-none")){
        document.getElementById("mobSaleBudget").classList.add("d-none")
    }

    if(document.getElementById("mobRentBudget").classList.contains("d-none")){
        document.getElementById("mobRentBudget").classList.remove("d-none")
    }
    // if(!document.getElementById("mobRentBudget").classList.contains("d-none")){
    //     document.getElementById("mobRentBudget").classList.add("d-none")
    // }
}