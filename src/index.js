window.addEventListener("DOMContentLoaded", () => {
    let un = {};
    let fulfilled = false;

    document.querySelectorAll("then, else").forEach(element => {
        element.style.display = 'none';
    });

    document.querySelectorAll("var").forEach(element => {
        un[`ht-${element.getAttribute("name")}`] = element.getAttribute("value") || '';
    });

    ["show", "print", "log"].forEach(tagName => {
        document.querySelectorAll(tagName).forEach(el => {
            const name = el.getAttribute("name");
            const key = `ht-${name}`;
            const value = un[key];
            const p = document.createElement("p");

            if (value !== undefined) {
                p.innerText = value;
            } else {
                p.innerHTML = `<span style="color: red;">Value of "${name}" not found</span>`;
                console.error(`Value of "${name}" not found`);
            }

            el.replaceWith(p);
        });
    });

    const conditionRegex = /^([a-zA-Z0-9_]+)\s*(==|!=|>|>=|<=|<)\s*(["']?.+["']?|\d+(\.\d+)?)$/;

    document.querySelectorAll("if").forEach(parent => {
        const cond = parent.getAttribute("cond");

        if (conditionRegex.test(cond)) {
            const [_, leftName, operator, rightSide] = cond.match(conditionRegex);

            const leftKey = `ht-${leftName}`;
            let leftValue;
            let rightValue;

            if (un.hasOwnProperty(leftKey)) {
                leftValue = un[leftKey];
                if (!isNaN(leftValue)) {
                    leftValue = parseFloat(leftValue);
                }
            } else {
                leftValue = leftName;
            }

            if (rightSide.startsWith('"') || rightSide.startsWith("'")) {
                rightValue = rightSide.slice(1, -1);
            } else if (rightSide.startsWith('ht-')) {
                rightValue = un[rightSide] || '';
                if (!isNaN(rightValue)) {
                    rightValue = parseFloat(rightValue);
                }
            } else {
                rightValue = parseFloat(rightSide);
            }

            let result = false;
            switch (operator) {
                case '==':
                    result = leftValue == rightValue;
                    break;
                case '!=':
                    result = leftValue != rightValue;
                    break;
                case '>':
                    result = leftValue > rightValue;
                    break;
                case '>=':
                    result = leftValue >= rightValue;
                    break;
                case '<':
                    result = leftValue < rightValue;
                    break;
                case '<=':
                    result = leftValue <= rightValue;
                    break;
            }

            if (result) {
                fulfilled = true;
                parent.querySelectorAll("then").forEach(thenElement => {
                    thenElement.style.display = 'block';
                });
                parent.querySelectorAll("else").forEach(elseElement => {
                    elseElement.style.display = 'none';
                });
            } else {
                parent.querySelectorAll("else").forEach(elseElement => {
                    if (elseElement.parentElement.tagName.toLowerCase() === 'if') {
                        elseElement.style.display = 'none';
                    }
                });
            }
        } else {
            console.error("Invalid condition:", cond);
        }
    });

    if (!fulfilled) {
        document.querySelectorAll("else").forEach(elseElement => {
            if (elseElement.parentElement.tagName.toLowerCase() === 'if') {
                elseElement.querySelectorAll("then").forEach(thenElement => {
                    thenElement.style.display = 'block';
                });
                elseElement.style.display = 'block';
            }
        });
    }

    console.log(un);
});