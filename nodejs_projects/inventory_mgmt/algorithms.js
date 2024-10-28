function validBraces(braces){
  const values = {'(':')', '{':'}', '[':']'};
  let stack = [];
  
  for (let i=0; i<braces.length; i++){
    if(Object.keys(values).includes(braces[i])){
      stack.push(braces[i]);
      // now stack = (
    } else if (stack.length == 0 || values[stack.pop()] != braces[i]) {
      return false;
    }
  }
  return stack.length === 0 ? true : false;
}

function maskify(cc) {
  if (cc.length < 5) return cc;
  const slicedString = cc.slice(0, -4);
  const lastString = cc.slice(-4);
  const maskedString = [...new Array(slicedString.length).fill('#')].join("").concat(lastString);
  return maskedString;
}

function SeriesSum(n) {
    let s = 0
    for (s, i = 0; i < n; i++) {
        s += 1 / (1 + i * 3)
    }

    return s.toFixed(2)
}

function domainName(url){
  return url.replace(/(https?:\/\/)?(www.)?/, '').split('.')[0]
}


class Node{
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class LinkedList{
    constructor(){
        this.head = null;
        this.size = 0;
    }
    insertAtEnd(value) {
        let node = new Node(value);
        let current;

        if (this.head == null) {
            this.head = node;
        }
        else {
            current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.size++;
        return node;
    }
    insertAtStart(value) {
        let newNode = new Node(value);
        let temp;
        if (this.head == null) {
            this.head = newNode;
        }
        temp = this.head;
        this.head = newNode;
        newNode.next = temp;
        temp = null;
        return newNode;
    }
}

const linkedList = new LinkedList()
head = linkedList.insertAtEnd(4);
tail = linkedList.insertAtStart(5);
// tail2 = linkedList.insertAtEnd(6);

console.log(linkedList);