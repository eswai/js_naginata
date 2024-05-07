<script>
    import { ngpress, ngrelease } from "$lib/naginata_v15";

    let ngtext = '';
    let lastCharacter = '';

    function keyPress(event) {
        // キーリビート対策
        if (event.key == lastCharacter) {
            return;
        }
        // カーソル位置
        let ss = this.selectionStart;
        let se = this.selectionEnd;

        const kana = ngpress(event.key);
        console.log(kana);
        for (const k of kana) {
            const l = typeText(k, ss, se);
            ss += l;
            se += l;
            // setTimeoutしないとBSがおかしかった(Firefox)
            setTimeout(()=>this.setSelectionRange(ss, ss));
        }
        lastCharacter = event.key;
    }

    function keyRelease(event) {
        let ss = this.selectionStart;
        let se = this.selectionEnd;

        const kana = ngrelease(event.key);
        console.log(kana);
        for (const k of kana) {
            const l = typeText(k, ss, se);
            ss += l;
            se += l;
            setTimeout(()=>this.setSelectionRange(ss, ss));
        }
        lastCharacter = '';
    }

    function typeText(s, selectionStart, selectionEnd) {
        if (s.startsWith('<') && s.endsWith('>')) {
            switch(s) {
                case '<Backspace>':
                    ngtext = ngtext.substring(0, selectionStart - 1) + ngtext.substring(selectionEnd);
                    return -1;
                case '<Up>':
                    return -1;
                case '<Down>':
                    return 1;
                case '<Left>':
                    return -1;
                case '<Right>':
                    return 1;
            }

        } else {
            ngtext = ngtext.substring(0, selectionStart) + s + ngtext.substring(selectionEnd);
            return s.length;
        }
    }
</script>

<textarea
    rows="20"
    cols="60"
    on:keydown|preventDefault={keyPress}
    on:keyup|preventDefault={keyRelease}
>{ngtext}</textarea>
