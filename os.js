function moveCover(f,s){
    if(f==0){
        $("#cover").animate({left:'+=100px',width:'-=100px'},s);
    }
    else{
        $("#cover").animate({left:'+=44px',width:'-=44px'},s);
    }
    
}

let rows = 2;
document.getElementById("cover").hidden = false;
document.getElementById("mytb").hidden = false;
let table = document.getElementById("input-table");

function radioClicked(e){
    if(e=="RR"){
        document.getElementById("timetext").innerHTML='Enter Time Quanta:-';
        document.getElementById("TQ").placeholder='Enter Time Quanta';
        document.getElementById("timequanta").style.display='flex';
        var pl=document.getElementsByClassName("priority-input");
        for(i=0;i<pl.length;i++){
            pl[i].disabled=true;
        }
    }
  
    else{
        document.getElementById("timequanta").style.display='none';
        var pl=document.getElementsByClassName("priority-input");
        for(i=0;i<pl.length;i++){
            pl[i].disabled=true;
        }
    }
}

function addRow() {
    let AT = document.getElementById("AT").value;
    let BT = document.getElementById("BT").value;
    if (AT == "" || BT == "") {
        alert("Empty field");
    }
    else {
        if (Number(AT) < 0 || Number(BT) < 0) {
            alert("Invalid Values!");
            return;
        }
        if (Math.floor(Number(AT)) != Number(AT)) {
            alert("Enter integer value Arrival time!");
            return;
        }
        if (Math.floor(Number(BT)) != Number(BT)) {
            alert("Enter integer value Burst time!");
            return;
        }
        let row = table.insertRow(rows);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);
      
        cell1.innerHTML = "P" + (rows - 1);
        cell2.innerHTML = AT;
        cell3.innerHTML = BT;
        cell4.innerHTML = "";
        cell5.innerHTML = "";
        cell6.innerHTML = "";
        cell7.innerHTML = "";
     
        rows++;
        document.getElementById("BT").value = "";
        document.getElementById("AT").value = "";
    }
}



function deleteRow() {
    if (rows == 2) {
        alert("Cannot delete anymore rows");
    }
    else {
        table.deleteRow(rows - 1);
        rows--;
    }
}

function addProcesses(time, processes, queue, check_pro, bt) {
    for (i = 1; i <= processes; i++) {
        let at = table.rows[1 + i].cells[1].innerHTML;
        let et = table.rows[1 + i].cells[2].innerHTML;
        let a = Number(at);
        let b = Number(et);
        if (a <= time && check_pro[i] == false) {
            queue.push(i);
            bt.push(b);
            check_pro[i] = true;
        }
    }
}


function animator(pr, tr, r, b) {
    if (r == 0) {
        var t = pr.insertCell(-1);
        t.innerHTML = "CPU Idle";
        var td = tr.insertCell(-1);
        td.innerHTML = "" + b;
        var temp = b * 1000;
        moveCover(0, temp);
    }
    else {
        var t = pr.insertCell(-1);
        t.innerHTML = "P" + r;
        var td = tr.insertCell(-1);
        td.innerHTML = "" + b;
        var temp = b * 1000;
        moveCover(1, temp);
    }
}

function calAverage(p) {
    let avgct = 0;
    let avgtat = 0;
    for (i = 1; i <= p; i++) {
        let ct = Number(table.rows[1 + i].cells[5].innerHTML);
        let tat = Number(table.rows[1 + i].cells[4].innerHTML);
        avgct = Number(avgct) + ct;
        avgtat = Number(avgtat) + tat;
    }
    avgct = avgct / p;
    avgtat = avgtat / p;
    avgct = avgct.toPrecision(3);
    avgtat = avgtat.toPrecision(3);
    document.getElementById('averagebox1').value = avgct;
    document.getElementById('averagebox2').value = avgtat;
}

function calculate() {
    let processes = rows - 2;
    document.getElementById("cover");
    document.getElementById("cover");
    document.getElementById("processr").innerHTML = "";
    document.getElementById("timer").innerHTML = "";
    
    //SJF
    if (document.getElementById("SJF").checked) {
        let time = 0;
        let check_pro = [];
        for (i = 1; i <= processes; i++) {
            check_pro[i] = false;
        }
        let queue = [];
        let bt = [];
        let counter = 0;
        addProcesses(time, processes, queue, check_pro, bt);
        if (queue.length == 0) {
            let flag = 0;
            for (j = 1; j <= processes; j++) {
                if (check_pro[j] == false) {
                    flag++;
                    break;
                }
            }
            let at = Number(table.rows[1 + j].cells[1].innerHTML);
            let b = Number(table.rows[1 + j].cells[2].innerHTML);
            var pr = document.getElementById("processr");
            var tr = document.getElementById("timer");
            animator(pr, tr, 0, at);
            time = at;
            addProcesses(time, processes, queue, check_pro, bt);
        }
        while (!(queue.length == 0)) {
            let r = 0;
            let min = Math.min(...bt);
            let index = bt.indexOf(min);
            if (index == -1) {
                break;
            }
            else {
                bt.splice(index, 1);
                r = queue[index];
                let myt = document.getElementById("mytb");
                var pr = document.getElementById("processr");
                var tr = document.getElementById("timer");
                animator(pr, tr, r, min);
                queue.splice(index, 1);
                table.rows[1 + r].cells[3].innerHTML = Number(time) - Number(table.rows[1 + r].cells[1].innerHTML);
                time = Number(time) + Number(min);
                let at = Number(table.rows[1 + r].cells[1].innerHTML);
                table.rows[1 + r].cells[5].innerHTML = time;
                table.rows[1 + r].cells[4].innerHTML = time - at;
                table.rows[1 + r].cells[6].innerHTML = (time - at) - min;
                addProcesses(time, processes, queue, check_pro, bt);
                if (queue.length == 0) {
                    let flag = 0;
                    for (i = 1; i <= processes; i++) {
                        if (check_pro[i] == false) {
                            flag++;
                            break;
                        }
                    }
                    if (flag == 0) {
                        break;
                    }
                    else {
                        let at = Number(table.rows[1 + i].cells[1].innerHTML);
                        let b = Number(table.rows[1 + i].cells[2].innerHTML);
                        var pr = document.getElementById("processr");
                        var tr = document.getElementById("timer");
                        animator(pr, tr, 0, at - time);
                        time = at;
                        addProcesses(time, processes, queue, check_pro, bt);
                    }
                }
            }
        }
        calAverage(processes);
       
    }



    //RR algorithm
    else if (document.getElementById("RR").checked) {
        var TQ = document.getElementById("TQ").value;
        if (TQ == "") {
            alert("Enter time quanta value!");
            return;
        }
        let tq = Number(document.getElementById("TQ").value);
        if (Math.floor(tq) != tq) {
            alert("Enter integer value of time quanta!");
            return;
        }
        let time = 0;
        let check_pro = [];
        for (i = 1; i <= processes; i++) {
            check_pro[i] = false;
        }
        let queue = [];
        let bt = [];
        let counter = 0;
        addProcesses(time, processes, queue, check_pro, bt);
        if (queue.length == 0) {
            let flag = 0;
            for (j = 1; j <= processes; j++) {
                if (check_pro[j] == false) {
                    flag++;
                    break;
                }
            }
            let at = Number(table.rows[1 + j].cells[1].innerHTML);
            let b = Number(table.rows[1 + j].cells[2].innerHTML);
            var pr = document.getElementById("processr");
            var tr = document.getElementById("timer");
            animator(pr, tr, 0, at);
            time = at;
            addProcesses(time, processes, queue, check_pro, bt);
        }
        while (!(queue.length == 0)) {
            let i = queue[0];
            if (bt[0] <= tq) {
                let temp2 = Number(bt[0]);
                queue.shift();
                bt.shift();
                if (table.rows[1 + i].cells[3].innerHTML == "") {
                    table.rows[1 + i].cells[3].innerHTML = (Number(time) - Number(table.rows[1 + i].cells[1].innerHTML));
                    table.rows[1 + i].cells[5].innerHTML = (time + temp2);
                    table.rows[1 + i].cells[4].innerHTML = (Number(table.rows[1 + i].cells[5].innerHTML) - Number(table.rows[1 + i].cells[1].innerHTML));
                    table.rows[1 + i].cells[6].innerHTML = (Number(table.rows[1 + i].cells[4].innerHTML) - Number(table.rows[1 + i].cells[2].innerHTML));
                }
                else {
                    table.rows[1 + i].cells[5].innerHTML = (time + temp2);
                    table.rows[1 + i].cells[4].innerHTML = (Number(table.rows[1 + i].cells[5].innerHTML) - Number(table.rows[1 + i].cells[1].innerHTML));
                    table.rows[1 + i].cells[6].innerHTML = (Number(table.rows[1 + i].cells[4].innerHTML) - Number(table.rows[1 + i].cells[2].innerHTML));
                }
                var pr = document.getElementById("processr");
                var tr = document.getElementById("timer");
                animator(pr, tr, i, temp2);
                time = time + temp2;
                addProcesses(time, processes, queue, check_pro, bt);
            }

            else if (bt[0] > tq) {
                var temp = bt[0] - tq;
                queue.shift();
                bt.shift();
                var pr = document.getElementById("processr");
                var tr = document.getElementById("timer");
                animator(pr, tr, i, tq);
                if (table.rows[1 + i].cells[3].innerHTML == "") {
                    table.rows[1 + i].cells[3].innerHTML = (Number(time) - Number(table.rows[1 + i].cells[1].innerHTML));;
                }
                time = time + tq;
                addProcesses(time, processes, queue, check_pro, bt);
                queue.push(i);
                bt.push(temp);
            }

            if (queue.length == 0) {
                let flag = 0;
                for (j = 1; j <= processes; j++) {
                    if (check_pro[j] == false) {
                        flag++;
                        break;
                    }
                }
                if (flag == 0) {
                    break;
                }
                else {
                    let at = Number(table.rows[1 + j].cells[1].innerHTML);
                    let b = Number(table.rows[1 + j].cells[2].innerHTML);
                    var pr = document.getElementById("processr");
                    var tr = document.getElementById("timer");
                    animator(pr, tr, 0, at - time);
                    time = at;
                    addProcesses(time, processes, queue, check_pro, bt);
                }
            }
        }
        calAverage(processes);
       
    }


    //SRTF
    else if (document.getElementById("SRTF").checked) {
        let time = 0;
        let check_pro = [];
        let pr = document.getElementById("processr");
        let tr = document.getElementById("timer");
        for (i = 1; i <= processes; i++) {
            check_pro[i] = false;
        }
        let queue = [];
        let bt = [];
        addProcesses(time, processes, queue, check_pro, bt);
        if (queue.length == 0) {
            let flag = 0;
            for (j = 1; j <= processes; j++) {
                if (check_pro[j] == false) {
                    flag++;
                    break;
                }
            }
            let at = Number(table.rows[1 + j].cells[1].innerHTML);
            let b = Number(table.rows[1 + j].cells[2].innerHTML);
            animator(pr, tr, 0, at);
            time = at;
            addProcesses(time, processes, queue, check_pro, bt);
        }

        while (!(queue.length == 0)) {
            let tq = 1;
            let f = 0;
            let i = 0;
            let min_value = Infinity;
            bt.forEach(element => {
                if (element < min_value && element != 0) {
                    min_value = element;
                }
            })
            if (min_value != Infinity) {
                i = bt.indexOf(min_value);
                f = 1;
            }

            if (bt[i] > 0 && f == 1) {
                if (bt[i] == Number(table.rows[2 + i].cells[2].innerHTML)) {
                    table.rows[2 + i].cells[3].innerHTML = "" + (time - Number(table.rows[2 + i].cells[1].innerHTML));
                }
                ++time;
                animator(pr, tr, i + 1, tq);
                bt[i] = bt[i] - 1;
                if (bt[i] == 0) {
                    table.rows[2 + i].cells[5].innerHTML = "" + time;
                }
                addProcesses(time, processes, queue, check_pro, bt);
            }

            if (queue.length == 0 || f == 0) {
                let flag = 0;
                for (j = 1; j <= processes; j++) {
                    if (check_pro[j] == false) {
                        flag++;
                        break;
                    }
                }
                if (flag == 0) {
                    break;
                }
                else {
                    let at = Number(table.rows[1 + j].cells[1].innerHTML);
                    let b = Number(table.rows[1 + j].cells[2].innerHTML);
                    animator(pr, tr, 0, at - time);
                    time = at;
                    addProcesses(time, processes, queue, check_pro, bt);
                }
            }

            if (f == 0) {
                min_value = Infinity;
                bt.forEach(element => {
                    if (element < min_value && element != 0) {
                        min_value = element;
                    }
                })
                if (min_value == Infinity) {
                    break;
                }
            }
        }
        for (i = 0; i < processes; ++i) {
            table.rows[2 + i].cells[4].innerHTML = Number(table.rows[2 + i].cells[5].innerHTML) - Number(table.rows[2 + i].cells[1].innerHTML);
            table.rows[2 + i].cells[6].innerHTML = Number(table.rows[2 + i].cells[4].innerHTML) - Number(table.rows[2 + i].cells[2].innerHTML);
        }
        calAverage(processes);
       
    }
    else {
        alert("Select a Radio Button");
    }
}