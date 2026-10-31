
function formatStr(inString) {
    var outString = ''
    if (inString.substring(0, 2) == "- ") {
        outString = '&bull;' + inString.substring(1)
    }
    else {
        outString = inString
    };
    if (outString.includes("~a href") && outString.includes("~/a~")) {
        outString = outString.replace("~a href","<a href").replace("~",">").replace("~/a~","</a>")
    }
    while (outString.includes("~b~")) {
        outString = outString.replace("~b~","<b>")
        if (outString.includes("~b~")) {
            outString = outString.replace("~b~","</b>")
        } else {
            outString += "</b>"
        }
    }
    if (outString.includes("~b1~")) {
        outString = outString.replace("~b1~",'<span style="color: black; font-size: 24px; font-weight: bold;">')
        if (outString.includes("~b1~")) {
            outString = outString.replace("~b1~","</span>")
        } else {
            outString += "</span>"
        }
    }
    if (outString.includes("~b2~")) {
        outString = outString.replace("~b2~",'<span style="color: black; font-size: 16px; font-weight: bold;">')
        if (outString.includes("~b2~")) {
            outString = outString.replace("~b2~","</span>")
        } else {
            outString += "</span>"
        }
    }
    if (outString.includes("~r~")) {
        outString = outString.replace("~r~",'<span style="float: right;">')
        outString += "</span>"
    }
    while (outString.includes("~i~")) {
        outString = outString.replace("~i~","<i>")
        if (outString.includes("~i~")) {
            outString = outString.replace("~i~","</i>")
        } else {
            outString += "</i>"
        }
    }
    while (outString.includes("~u~")) {
        outString = outString.replace("~u~","<u>")
        if (outString.includes("~u~")) {
            outString = outString.replace("~u~","</u>")
        } else {
            outString += "</u>"
        }
    }
    while (outString.includes("~m~")) {
        outString = outString.replace("~m~","<mark>")
        if (outString.includes("~m~")) {
            outString = outString.replace("~m~","</mark>")
        } else {
            outString += "</mark>"
        }
    }

    while (outString.includes("~he~")) {
        outString = outString.replace("~he~",'<span class="hebrew" lang="he" dir="rtl">')
        if (outString.includes("~he~")) {
            outString = outString.replace("~he~","</span>&lrm;")
        } else {
            outString += "</span>&lrm;"
        }
    }
    
    while (outString.includes("~g~")) {
        outString = outString.replace("~g~",'<span style="color: black; background-color: #76d598; font-weight;">')
        if (outString.includes("~g~")) {
            outString = outString.replace("~g~","</span>")
        } else {
            outString += "</span>"
        }
    }
    while (outString.includes("~rd~")) {
        outString = outString.replace("~rd~",'<span style="color: black; background-color: #FF8A8A; font-weight;">')
        if (outString.includes("~rd~")) {
            outString = outString.replace("~rd~","</span>")
        } else {
            outString += "</span>"
        }
    }
    return outString
};


function formatRmv(inString) {
    var outString = inString;
    while (outString.includes("~m~")) {
        outString = outString.replace("~m~","")
    }
    return outString
};

function formatAlert(inString) {
    var outString = inString;
    outString = outString.replace(/([a-zA-Z0-9 ])'/g, "$1\\'");
    return outString
};

        
/**
         * Converts basic Markdown (headers, lists, and paragraphs) to HTML using pure JavaScript.
         * This function manually handles nested lists based on simple indentation (4 spaces).
         */
function markdown_2_toc(markdown) {
    const lines = (markdown + "\n").split('\n');
    let toc = '<h1>' + document.title + '</h1>';
    toc += '<div class="container"><h2>Table of Contents</h2>'

    let h1_count = 0;
    let h2_count = 0;

    for (let line_i = 0; line_i < (lines.length - 1); line_i++) {
        const line = lines[line_i]; // The current line
        const hdr_chk = line.substring(0, 3);
        if (hdr_chk == "h1:") {
            h1_count += 1;
            hdr_name = formatRmv(line.substring(3));
            if (h1_count != 1) {toc += '<br>'};
            toc += '<span onclick="GoToChapter(' +  h1_count + ')" style="cursor: pointer; color: blue; text-decoration: none; font-size: 16px;">'
            toc += hdr_name + '</span><br>';
            h2_count = 0;
            continue;
        };
//        if (h1_count == display_chapter) {
            if (hdr_chk == "h2:") {
                h2_count += 1;
                toc += '&emsp; &emsp; <span style="font-size: 14px;">' + formatRmv(line.substring(3)) + '</span><br>';
            };
//        };
    };
    toc += '</div>';
    return toc;
};

function markdown_2_page(markdown) {
    const lines = (markdown + "\n").split('\n');
    let html = '';
    let page_top = '<span onclick="GoToChapter(0)" style="cursor: pointer; color: blue; text-decoration: underline; font-size: 18px;">[Table of Contents]</span>';
    let h2_count = 0;
    let h1_count = 0;
    let col_lines;
    let table_length = 0;
    let table_last_width = 0;
    let page_build = ""
    let answer_text = ""

    for (let line_i = 0; line_i < (lines.length - 1); line_i++) {
        const line = lines[line_i]; // The current line
        const hdr_chk = line.substring(0, 3);
        if (hdr_chk == "h1:") {
            h1_count += 1;
            hdr_name = line.substring(3);
            if (h1_count == display_chapter) {
                page_top += '<br><h1>' + line.substring(3) + '</h1><br>';
            };
            continue;
        };
        if (h1_count == display_chapter) {
            switch (hdr_chk) {
            case "===":
                break;
            case "h2:":
                h2_count += 1;
                page_top += '<a href="#' + 'S' + h2_count + '" style="text-decoration: none;">' + formatRmv(line.substring(3)) + '</a><br>';
                page_build += '<h2 id="' + 'S' + h2_count + '"><u>' + formatStr(line.substring(3)) + '</u></h2>'
                break;
            case "h3:":
                page_build += '<h3>' + formatStr(line.substring(3)) + '</h3>'
                break;
            case "h4:":
                page_build += '<h4>' + formatStr(line.substring(3)) + '</h4>'
                break;
            case "h5:":
                page_build += '<h5>' + formatStr(line.substring(3)) + '</h5>'
                break;
            case "hr:":
                page_build += '<hr style="height: 1px; background-color: grey; border: none; margin-top: 0px; margin-bottom: 0px;">'
                break;
            case "in:":
            case "ip:":
                page_build += '<p style="margin-left: 18px;";>' + formatStr(line.substring(3)) + '</p>'
                break;
            case "iq:":
                page_build += '<p style="margin-left: 36px;";>' + formatStr(line.substring(3)) + '</p>'
                break;
            case "pb:":
                break;
            case "tq:":
                page_build += '<table style="border: none; border-collapse: collapse;">'
                col_lines = line.substring(3).split("||");
                table_length = col_lines.length
                page_build += '<tr>'
                for (let table_i = 0; table_i <= table_length - 2; table_i++){
                    page_build += '<td style="width: 25%; text-align: left; border: none">' + formatStr(col_lines[table_i]) + '</td>'
                };
                table_last_width = 100 - 25 * (table_length - 2);
                page_build += '<td style="width: ' + table_last_width + '%; text-align: left; border: none">' 
                page_build += formatStr(col_lines[table_length - 1]) + '</td>'
                page_build += '</tr></table>'
                break;      
            case "t4:":
                page_build += '<table style="border: none; border-collapse: collapse;">'
                col_lines = line.substring(3).split("||");
                table_length = col_lines.length
                page_build += '<tr>'
                for (let table_i = 0; table_i <= table_length - 2; table_i++){
                    page_build += '<td style="width: 40%; text-align: left; border: none">' + formatStr(col_lines[table_i]) + '</td>'
                };
                table_last_width = 100 - 40 * (table_length - 2);
                page_build += '<td style="width: ' + table_last_width + '%; text-align: left; border: none">' 
                page_build += formatStr(col_lines[table_length - 1]) + '</td>'
                page_build += '</tr></table>'
                break;      
            case "t5:":
                page_build += '<table style="border: none; border-collapse: collapse;">'
                col_lines = line.substring(3).split("||");
                table_length = col_lines.length
                page_build += '<tr>'
                for (let table_i = 0; table_i <= table_length - 2; table_i++){
                    page_build += '<td style="width: 50%; text-align: left; border: none">' + formatStr(col_lines[table_i]) + '</td>'
                };
                table_last_width = 100 - 50 * (table_length - 2);
                page_build += '<td style="width: ' + table_last_width + '%; text-align: left; border: none">' 
                page_build += formatStr(col_lines[table_length - 1]) + '</td>'
                page_build += '</tr></table>'
                break;    
            case "aa:":
                answer_text = formatAlert(line.substring(3));
                page_build += '<p onclick="alert(' + "'" + answer_text + "'" + ')" style="cursor: pointer; color: blue; font-size: 13px;" >';
                page_build += 'Answer' + '</p>';
                break;    
            default:
                if (line.trim() == '') {
                    page_build += '<div style="height: 5px;"></div>';
                }
                else {
                    page_build += formatStr(line + '<br>')
                };
            };
        };
    };

    page_build += '<span onclick="GoToChapter(0)" style="cursor: pointer; color: blue; text-decoration: underline; font-size: 18px;">[Table of Contents]</span>';

    html += '<div class="container">' + page_top + page_build + '<br><br><br></div>';

    return html;
};

/**
         * Main function to trigger conversion on input.
         */
function convertMarkdown() {
    const markdownText = markdownInput.value;
    if  (display_chapter == 0) {
        try {
            var html_ret = markdown_2_toc(markdownText);
            html_display.innerHTML = html_ret;
        } catch (error) {
            html_display.innerHTML = `<p>Error in Native Conversion:</p><pre>${error.message}</pre>`;
            console.error("Native Markdown conversion failed:", error);
        };
    } else {
        try {
            var html_ret = markdown_2_page(markdownText);
            html_display.innerHTML = html_ret;
        } catch (error) {
            html_display.innerHTML = `<p>Error in Native Conversion:</p><pre>${error.message}</pre>`;
            console.error("Native Markdown conversion failed:", error);
        };
    };
};

function GoToChapter(inVal) {
    display_chapter = inVal;
    convertMarkdown()
    window.scrollTo(0, 0);
};

