let pressed_keys = new Set(); // 同時に押しているキー
let nginput = [];  // 未変換のキー [[KC.NGM], [KC.NGJ, KC.NGW]] (なぎ)のように、同時押しの組み合わせを2次元配列へ格納

const mask_keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'm', 'l', ';', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', ' '];

// かな変換テーブル setはdictionaryのキーにできないので配列に
const ngdic = [
    //  前置シフト      同時押し                        かな
    [  new Set()             , new Set([ 'u'                   ]), ['<Backspace>']],
    [  new Set()             , new Set([ ' '                   ]), [' '          ]],
    [  new Set()             , new Set([ 'm', 'v'              ]), ['\n'         ]],
    [  new Set()             , new Set([ 't'                   ]), ['<Left>'     ]],
    [  new Set()             , new Set([ 'y'                   ]), ['<Right>'    ]],
    // [  new Set([' '])        , new Set([ 't'                   ]), ['<Left>'     ]],
    // [  new Set([' '])        , new Set([ 'y'                   ]), ['<Right>'    ]],
    [  new Set()             , new Set([ ';'                   ]), ['ー'   ]], // ー
    [  new Set([' '])        , new Set([ 'v'                   ]), [ '、'  ]], // 、{Enter}
    [  new Set([' '])        , new Set([ 'm'                   ]), [ '。'  ]], // 。{Enter}

    [  new Set()             , new Set([ 'j'                   ]), ['あ'   ]], // あ
    [  new Set()             , new Set([ 'k'                   ]), ['い'   ]], // い
    [  new Set()             , new Set([ 'l'                   ]), ['う'   ]], // う
    [  new Set([' '])        , new Set([ 'o'                   ]), ['え'   ]], // え
    [  new Set([' '])        , new Set([ 'n'                   ]), ['お'   ]], // お
    [  new Set()             , new Set([ 'f'                   ]), ['か'   ]], // か
    [  new Set()             , new Set([ 'w'                   ]), ['き'   ]], // き
    [  new Set()             , new Set([ 'h'                   ]), ['く'   ]], // く
    [  new Set()             , new Set([ 's'                   ]), ['け'   ]], // け
    [  new Set()             , new Set([ 'v'                   ]), ['こ'   ]], // こ
    [  new Set([' '])        , new Set([ 'u'                   ]), ['さ'   ]], // さ
    [  new Set()             , new Set([ 'r'                   ]), ['し'   ]], // し
    [  new Set()             , new Set([ 'o'                   ]), ['す'   ]], // す
    [  new Set([' '])        , new Set([ 'a'                   ]), ['せ'   ]], // せ
    [  new Set()             , new Set([ 'b'                   ]), ['そ'   ]], // そ
    [  new Set()             , new Set([ 'n'                   ]), ['た'   ]], // た
    [  new Set([' '])        , new Set([ 'g'                   ]), ['ち'   ]], // ち
    [  new Set([' '])        , new Set([ 'l'                   ]), ['つ'   ]], // つ
    [  new Set()             , new Set([ 'e'                   ]), ['て'   ]], // て
    [  new Set()             , new Set([ 'd'                   ]), ['と'   ]], // と
    [  new Set()             , new Set([ 'm'                   ]), ['な'   ]], // な
    [  new Set([' '])        , new Set([ 'd'                   ]), ['に'   ]], // に
    [  new Set([' '])        , new Set([ 'w'                   ]), ['ぬ'   ]], // ぬ
    [  new Set([' '])        , new Set([ 'r'                   ]), ['ね'   ]], // ね
    [  new Set([' '])        , new Set([ 'j'                   ]), ['の'   ]], // の
    [  new Set()             , new Set([ 'c'                   ]), ['は'   ]], // は
    [  new Set()             , new Set([ 'x'                   ]), ['ひ'   ]], // ひ
    [  new Set([' '])        , new Set([ 'x'                   ]), ['ひ'   ]], // ひ
    [  new Set([' '])        , new Set([ ';'                   ]), ['ふ'   ]], // ふ
    [  new Set()             , new Set([ 'p'                   ]), ['へ'   ]], // へ
    [  new Set()             , new Set([ 'z'                   ]), ['ほ'   ]], // ほ
    [  new Set([' '])        , new Set([ 'z'                   ]), ['ほ'   ]], // ほ
    [  new Set([' '])        , new Set([ 'f'                   ]), ['ま'   ]], // ま
    [  new Set([' '])        , new Set([ 'b'                   ]), ['み'   ]], // み
    [  new Set([' '])        , new Set([ ','                   ]), ['む'   ]], // む
    [  new Set([' '])        , new Set([ 's'                   ]), ['め'   ]], // め
    [  new Set([' '])        , new Set([ 'k'                   ]), ['も'   ]], // も
    [  new Set([' '])        , new Set([ 'h'                   ]), ['や'   ]], // や
    [  new Set([' '])        , new Set([ 'p'                   ]), ['ゆ'   ]], // ゆ
    [  new Set([' '])        , new Set([ 'i'                   ]), ['よ'   ]], // よ
    [  new Set()             , new Set([ '.'                   ]), ['ら'   ]], // ら
    [  new Set([' '])        , new Set([ 'e'                   ]), ['り'   ]], // り
    [  new Set()             , new Set([ 'i'                   ]), ['る'   ]], // る
    [  new Set()             , new Set([ '/'                   ]), ['れ'   ]], // れ
    [  new Set([' '])        , new Set([ '/'                   ]), ['れ'   ]], // れ
    [  new Set()             , new Set([ 'a'                   ]), ['ろ'   ]], // ろ
    [  new Set([' '])        , new Set([ '.'                   ]), ['わ'   ]], // わ
    [  new Set([' '])        , new Set([ 'c'                   ]), ['を'   ]], // を
    [  new Set()             , new Set([ ','                   ]), ['ん'   ]], // ん
    [  new Set()             , new Set([ 'q'                   ]), ['ゔ'   ]], // ゔ
    [  new Set([' '])        , new Set([ 'q'                   ]), ['ゔ'   ]], // ゔ
    [  new Set()             , new Set([ 'j', 'f'              ]), ['が'   ]], // が
    [  new Set()             , new Set([ 'j', 'w'              ]), ['ぎ'   ]], // ぎ
    [  new Set()             , new Set([ 'f', 'h'              ]), ['ぐ'   ]], // ぐ
    [  new Set()             , new Set([ 'j', 's'              ]), ['げ'   ]], // げ
    [  new Set()             , new Set([ 'j', 'v'              ]), ['ご'   ]], // ご
    [  new Set()             , new Set([ 'f', 'u'              ]), ['ざ'   ]], // ざ
    [  new Set()             , new Set([ 'j', 'r'              ]), ['じ'   ]], // じ
    [  new Set()             , new Set([ 'f', 'o'              ]), ['ず'   ]], // ず
    [  new Set()             , new Set([ 'j', 'a'              ]), ['ぜ'   ]], // ぜ
    [  new Set()             , new Set([ 'j', 'b'              ]), ['ぞ'   ]], // ぞ
    [  new Set()             , new Set([ 'f', 'n'              ]), ['だ'   ]], // だ
    [  new Set()             , new Set([ 'j', 'g'              ]), ['ぢ'   ]], // ぢ
    [  new Set()             , new Set([ 'f', 'l'              ]), ['づ'   ]], // づ
    [  new Set()             , new Set([ 'j', 'e'              ]), ['で'   ]], // で
    [  new Set()             , new Set([ 'j', 'd'              ]), ['ど'   ]], // ど
    [  new Set()             , new Set([ 'j', 'c'              ]), ['ば'   ]], // ば
    [  new Set()             , new Set([ 'j', 'x'              ]), ['び'   ]], // び
    [  new Set()             , new Set([ 'f', ';'              ]), ['ぶ'   ]], // ぶ
    [  new Set()             , new Set([ 'f', 'p'              ]), ['べ'   ]], // べ
    [  new Set()             , new Set([ 'j', 'z'              ]), ['ぼ'   ]], // ぼ
    [  new Set()             , new Set([ 'f', 'l'              ]), ['ゔ'   ]], // ゔ
    [  new Set()             , new Set([ 'm', 'c'              ]), ['ぱ'   ]], // ぱ
    [  new Set()             , new Set([ 'm', 'x'              ]), ['ぴ'   ]], // ぴ
    [  new Set()             , new Set([ 'v', ';'              ]), ['ぷ'   ]], // ぷ
    [  new Set()             , new Set([ 'v', 'p'              ]), ['ぺ'   ]], // ぺ
    [  new Set()             , new Set([ 'm', 'z'              ]), ['ぽ'   ]], // ぽ
    [  new Set()             , new Set([ 'q', 'h'              ]), ['ゃ'   ]], // ゃ
    [  new Set()             , new Set([ 'q', 'p'              ]), ['ゅ'   ]], // ゅ
    [  new Set()             , new Set([ 'q', 'i'              ]), ['ょ'   ]], // ょ
    [  new Set()             , new Set([ 'q', 'j'              ]), ['ぁ'   ]], // ぁ
    [  new Set()             , new Set([ 'q', 'k'              ]), ['ぃ'   ]], // ぃ
    [  new Set()             , new Set([ 'q', 'l'              ]), ['ぅ'   ]], // ぅ
    [  new Set()             , new Set([ 'q', 'o'              ]), ['ぇ'   ]], // ぇ
    [  new Set()             , new Set([ 'q', 'n'              ]), ['ぉ'   ]], // ぉ
    [  new Set()             , new Set([ 'q', '.'              ]), ['ゎ'   ]], // ゎ
    [  new Set()             , new Set([ 'g'                   ]), ['っ'   ]], // っ
    [  new Set()             , new Set([ 'q', 's'              ]), ['ヶ'   ]], // ヶ
    [  new Set()             , new Set([ 'q', 'f'              ]), ['ヵ'   ]], // ヵ
    [  new Set()             , new Set([ 'r', 'h'              ]), ['しゃ' ]], // しゃ
    [  new Set()             , new Set([ 'r', 'p'              ]), ['しゅ' ]], // しゅ
    [  new Set()             , new Set([ 'r', 'i'              ]), ['しょ' ]], // しょ
    [  new Set()             , new Set([ 'j', 'r', 'h'         ]), ['じゃ' ]], // じゃ
    [  new Set()             , new Set([ 'j', 'r', 'p'         ]), ['じゅ' ]], // じゅ
    [  new Set()             , new Set([ 'j', 'r', 'i'         ]), ['じょ' ]], // じょ
    [  new Set()             , new Set([ 'w', 'h'              ]), ['きゃ' ]], // きゃ
    [  new Set()             , new Set([ 'w', 'p'              ]), ['きゅ' ]], // きゅ
    [  new Set()             , new Set([ 'w', 'i'              ]), ['きょ' ]], // きょ
    [  new Set()             , new Set([ 'j', 'w', 'h'         ]), ['ぎゃ' ]], // ぎゃ
    [  new Set()             , new Set([ 'j', 'w', 'p'         ]), ['ぎゅ' ]], // ぎゅ
    [  new Set()             , new Set([ 'j', 'w', 'i'         ]), ['ぎょ' ]], // ぎょ
    [  new Set()             , new Set([ 'g', 'h'              ]), ['ちゃ' ]], // ちゃ
    [  new Set()             , new Set([ 'g', 'p'              ]), ['ちゅ' ]], // ちゅ
    [  new Set()             , new Set([ 'g', 'i'              ]), ['ちょ' ]], // ちょ
    [  new Set()             , new Set([ 'j', 'g', 'h'         ]), ['ぢゃ' ]], // ぢゃ
    [  new Set()             , new Set([ 'j', 'g', 'p'         ]), ['ぢゅ' ]], // ぢゅ
    [  new Set()             , new Set([ 'j', 'g', 'i'         ]), ['ぢょ' ]], // ぢょ
    [  new Set()             , new Set([ 'd', 'h'              ]), ['にゃ' ]], // にゃ
    [  new Set()             , new Set([ 'd', 'p'              ]), ['にゅ' ]], // にゅ
    [  new Set()             , new Set([ 'd', 'i'              ]), ['にょ' ]], // にょ
    [  new Set()             , new Set([ 'x', 'h'              ]), ['ひゃ' ]], // ひゃ
    [  new Set()             , new Set([ 'x', 'p'              ]), ['ひゅ' ]], // ひゅ
    [  new Set()             , new Set([ 'x', 'i'              ]), ['ひょ' ]], // ひょ
    [  new Set()             , new Set([ 'j', 'x', 'h'         ]), ['びゃ' ]], // びゃ
    [  new Set()             , new Set([ 'j', 'x', 'p'         ]), ['びゅ' ]], // びゅ
    [  new Set()             , new Set([ 'j', 'x', 'i'         ]), ['びょ' ]], // びょ
    [  new Set()             , new Set([ 'm', 'x', 'h'         ]), ['ぴゃ' ]], // ぴゃ
    [  new Set()             , new Set([ 'm', 'x', 'p'         ]), ['ぴゅ' ]], // ぴゅ
    [  new Set()             , new Set([ 'm', 'x', 'i'         ]), ['ぴょ' ]], // ぴょ
    [  new Set()             , new Set([ 'b', 'h'              ]), ['みゃ' ]], // みゃ
    [  new Set()             , new Set([ 'b', 'p'              ]), ['みゅ' ]], // みゅ
    [  new Set()             , new Set([ 'b', 'i'              ]), ['みょ' ]], // みょ
    [  new Set()             , new Set([ 'e', 'h'              ]), ['りゃ' ]], // りゃ
    [  new Set()             , new Set([ 'e', 'p'              ]), ['りゅ' ]], // りゅ
    [  new Set()             , new Set([ 'e', 'i'              ]), ['りょ' ]], // りょ
    [  new Set()             , new Set([ 'm', 'e', 'k'         ]), ['てぃ' ]], // てぃ
    [  new Set()             , new Set([ 'm', 'e', 'p'         ]), ['てゅ' ]], // てゅ
    [  new Set()             , new Set([ 'j', 'e', 'k'         ]), ['でぃ' ]], // でぃ
    [  new Set()             , new Set([ 'j', 'e', 'p'         ]), ['でゅ' ]], // でゅ
    [  new Set()             , new Set([ 'm', 'd', 'l'         ]), ['とぅ' ]], // とぅ
    [  new Set()             , new Set([ 'j', 'd', 'l'         ]), ['どぅ' ]], // どぅ
    [  new Set()             , new Set([ 'm', 'r', 'o'         ]), ['しぇ' ]], // しぇ
    [  new Set()             , new Set([ 'm', 'g', 'o'         ]), ['ちぇ' ]], // ちぇ
    [  new Set()             , new Set([ 'j', 'r', 'o'         ]), ['じぇ' ]], // じぇ
    [  new Set()             , new Set([ 'j', 'g', 'o'         ]), ['ぢぇ' ]], // ぢぇ
    [  new Set()             , new Set([ 'v', ';', 'j'         ]), ['ふぁ' ]], // ふぁ
    [  new Set()             , new Set([ 'v', ';', 'k'         ]), ['ふぃ' ]], // ふぃ
    [  new Set()             , new Set([ 'v', ';', 'o'         ]), ['ふぇ' ]], // ふぇ
    [  new Set()             , new Set([ 'v', ';', 'n'         ]), ['ふぉ' ]], // ふぉ
    [  new Set()             , new Set([ 'v', ';', 'p'         ]), ['ふゅ' ]], // ふゅ
    [  new Set()             , new Set([ 'v', 'k', 'o'         ]), ['いぇ' ]], // いぇ
    [  new Set()             , new Set([ 'v', 'l', 'k'         ]), ['うぃ' ]], // うぃ
    [  new Set()             , new Set([ 'v', 'l', 'o'         ]), ['うぇ' ]], // うぇ
    [  new Set()             , new Set([ 'v', 'l', 'n'         ]), ['うぉ' ]], // うぉ
    [  new Set()             , new Set([ 'm', 'q', 'j'         ]), ['ゔぁ' ]], // ゔぁ
    [  new Set()             , new Set([ 'm', 'q', 'k'         ]), ['ゔぃ' ]], // ゔぃ
    [  new Set()             , new Set([ 'm', 'q', 'o'         ]), ['ゔぇ' ]], // ゔぇ
    [  new Set()             , new Set([ 'm', 'q', 'n'         ]), ['ゔぉ' ]], // ゔぉ
    [  new Set()             , new Set([ 'm', 'q', 'p'         ]), ['ゔゅ' ]], // ゔゅ
    [  new Set()             , new Set([ 'v', 'h', 'j'         ]), ['くぁ' ]], // くぁ
    [  new Set()             , new Set([ 'v', 'h', 'k'         ]), ['くぃ' ]], // くぃ
    [  new Set()             , new Set([ 'v', 'h', 'o'         ]), ['くぇ' ]], // くぇ
    [  new Set()             , new Set([ 'v', 'h', 'n'         ]), ['くぉ' ]], // くぉ
    [  new Set()             , new Set([ 'v', 'h', '.'         ]), ['くゎ' ]], // くゎ
    [  new Set()             , new Set([ 'f', 'h', 'j'         ]), ['ぐぁ' ]], // ぐぁ
    [  new Set()             , new Set([ 'f', 'h', 'k'         ]), ['ぐぃ' ]], // ぐぃ
    [  new Set()             , new Set([ 'f', 'h', 'o'         ]), ['ぐぇ' ]], // ぐぇ
    [  new Set()             , new Set([ 'f', 'h', 'n'         ]), ['ぐぉ' ]], // ぐぉ
    [  new Set()             , new Set([ 'f', 'h', '.'         ]), ['ぐゎ' ]], // ぐゎ
    [  new Set()             , new Set([ 'v', 'l', 'j'         ]), ['つぁ' ]], // つぁ

    [  new Set(['j', 'k'])   , new Set([ 'd'                   ]), ['？'   ]], // ？{改行}
    [  new Set(['j', 'k'])   , new Set([ 'c'                   ]), ['！'   ]], // ！{改行}

//     ({ KC.NGJ, KC.NGK    }, { KC.NGQ    }, [ KC.LGUI(KC.DOWN)                                   ]), // ^{End}
//     ({ KC.NGJ, KC.NGK    }, { KC.NGW    }, [ unicode_string_sequence('『』'), KC.UP             ]), // 『』{改行}{↑}
    [  new Set(['j', 'k'])   , new Set([ 'e'                   ]), ['でぃ'                         ]], // /*ディ*/
//     ({ KC.NGJ, KC.NGK    }, { KC.NGR    }, [ KC.LGUI(KC.S)                                      ]), // ^s
    [  new Set(['j', 'k'])   , new Set([ 't'                   ]), ['・'                           ]], // ・
    [  new Set(['j', 'k'])   , new Set([ 'a'                   ]), ['……'                         ]], // ……{改行}
//     ({ KC.NGJ, KC.NGK    }, { KC.NGS    }, [ unicode_string_sequence('()'), KC.UP               ]), // (){改行}{↑}
    [  new Set(['j', 'k'])   , new Set([ 'f'                   ]), ['「」', '<Left>'               ]], // // 「」{改行}{↑}
//     ({ KC.NGJ, KC.NGK    }, { KC.NGG    }, [ unicode_string_sequence('《》'), KC.UP             ]), // 《》{改行}{↑}
//     ({ KC.NGJ, KC.NGK    }, { KC.NGZ    }, [ unicode_string_sequence('――')                    ]), // ――{改行}
//     ({ KC.NGJ, KC.NGK    }, { KC.NGX    }, [ unicode_string_sequence('【】'), KC.UP             ]), // 【】{改行}{↑}
//     ({ KC.NGJ, KC.NGK    }, { KC.NGV    }, [ KC.ENT, KC.DOWN                                    ]), // {改行}{↓}
//     ({ KC.NGJ, KC.NGK    }, { KC.NGB    }, [ KC.ENT, KC.LEFT                                    ]), // {改行}{←}

//     ({ KC.NGD, KC.NGF    }, { KC.NGY    }, [ KC.LCTL(KC.A)                                      ]), // {Home}
//     ({ KC.NGD, KC.NGF    }, { KC.NGU    }, [ KC.LSFT(KC.LCTL(KC.E)), KC.BSPC                    ]), // +{End}{BS}
//     ({ KC.NGD, KC.NGF    }, { KC.NGI    }, [ KC.LANG1, KC.LANG1                                 ]), // {vk1Csc079}
//     ({ KC.NGD, KC.NGF    }, { KC.NGO    }, [ KC.DEL                                             ]), // {Del}
//     ({ KC.NGD, KC.NGF    }, { KC.NGP    }, [ KC.ESC, KC.ESC, KC.ESC                             ]), // {Esc 3}
//     ({ KC.NGD, KC.NGF    }, { KC.NGH    }, [ KC.ENT, KC.LCTL(KC.E)                              ]), // {Enter}{End}
//     ({ KC.NGD, KC.NGF    }, { KC.NGJ    }, [ KC.UP                                              ]), // {↑}
//     ({ KC.NGD, KC.NGF    }, { KC.NGK    }, [ KC.LSFT(KC.UP)                                     ]), // +{↑}
//     ({ KC.NGD, KC.NGF    }, { KC.NGL    }, [ KC.LSFT(KC.UP)] * 7                                 ), // +{↑ 7}
//     ({ KC.NGD, KC.NGF    }, { KC.NGSCLN }, [ KC.LCTL(KC.K)                                      ]), // ^i
//     ({ KC.NGD, KC.NGF    }, { KC.NGN    }, [ KC.LCTL(KC.E)                                      ]), // {End}
//     ({ KC.NGD, KC.NGF    }, { KC.NGM    }, [ KC.DOWN                                            ]), // {↓}
//     ({ KC.NGD, KC.NGF    }, { KC.NGCOMM }, [ KC.LSFT(KC.DOWN)                                   ]), // +{↓}
//     ({ KC.NGD, KC.NGF    }, { KC.NGDOT  }, [ KC.LSFT(KC.DOWN)] * 7                               ), // +{↓ 7}
//     ({ KC.NGD, KC.NGF    }, { KC.NGSLSH }, [ KC.LCTL(KC.J)                                      ]), // ^u

//     ({ KC.NGM, KC.NGCOMM }, { KC.NGQ    }, [ KC.LCTL(KC.A), KC.RIGHT, KC.LCTL(KC.E), KC.DEL, KC.DEL, KC.DEL, KC.DEL, KC.LEFT ]), // {Home}{→}{End}{Del 4}{←}
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGW    }, [ KC.LGUI(KC.X), unicode_string_sequence('『'), KC.LGUI(KC.V), unicode_string_sequence('』'), KC.SPC, KC.LSFT(KC.UP), KC.LGUI(KC.X)]), // ^x『^v』{改行}{Space}+{↑}^x
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGE    }, [ KC.LCTL(KC.A), KC.ENT, KC.SPC, KC.SPC, KC.SPC, KC.LEFT ]), // {Home}{改行}{Space 3}{←}
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGR    }, [ KC.SPC, KC.SPC, KC.SPC                             ]), // {Space 3}
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGT    }, [ unicode_string_sequence('〇')                      ]), // 〇{改行}
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGA    }, [ KC.LCTL(KC.A), KC.RIGHT, KC.LCTL(KC.E), KC.DEL, KC.DEL, KC.LEFT ]), // {Home}{→}{End}{Del 2}{←}
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGS    }, [ KC.LGUI(KC.X), unicode_string_sequence('('), KC.LGUI(KC.V), unicode_string_sequence(')'), KC.SPC, KC.LSFT(KC.UP), KC.LGUI(KC.X)]), // ^x(^v){改行}{Space}+{↑}^x
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGD    }, [ KC.LCTL(KC.A), KC.ENT, KC.SPC, KC.LEFT             ]), // {Home}{改行}{Space 1}{←}
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGF    }, [ KC.LGUI(KC.X), unicode_string_sequence('「'), KC.LGUI(KC.V), unicode_string_sequence('」'), KC.SPC, KC.LSFT(KC.UP), KC.LGUI(KC.X)]), // ^x「^v」{改行}{Space}+{↑}^x
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGG    }, [ KC.LGUI(KC.X), unicode_string_sequence('｜'), KC.LGUI(KC.V), unicode_string_sequence('《》'), KC.UP, KC.SPC, KC.LSFT(KC.UP), KC.LGUI(KC.X)]), // ^x｜{改行}^v《》{改行}{↑}{Space}+{↑}^x
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGZ    }, [ unicode_string_sequence('　　　×　　　×　　　×'), KC.ENT]), // 　　　×　　　×　　　×{改行 2}
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGX    }, [ KC.LGUI(KC.X), unicode_string_sequence('【'), KC.LGUI(KC.V), unicode_string_sequence('】'), KC.SPC, KC.LSFT(KC.UP), KC.LGUI(KC.X)]), // ^x【^v】{改行}{Space}+{↑}^x
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGC    }, [ unicode_string_sequence('／')                      ]), // ／{改行}
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGV    }, [ KC.ENT, KC.LCTL(KC.E), unicode_string_sequence('「」'), KC.UP]), // {改行}{End}{改行}「」{改行}{↑}
//     ({ KC.NGM, KC.NGCOMM }, { KC.NGB    }, [ KC.ENT, KC.LCTL(KC.E), KC.ENT, KC.SPC              ]), // {改行}{End}{改行}{Space}

//     ({ KC.NGC, KC.NGV    }, { KC.NGY    }, [ KC.LSFT(KC.LCTL(KC.A))                             ]), // +{Home}
//     ({ KC.NGC, KC.NGV    }, { KC.NGU    }, [ KC.LGUI(KC.X)                                      ]), // ^x
//     ({ KC.NGC, KC.NGV    }, { KC.NGI    }, [ KC.LGUI(KC.V)                                      ]), // ^v
//     ({ KC.NGC, KC.NGV    }, { KC.NGO    }, [ KC.LSFT(KC.LGUI(KC.Z))                             ]), // ^y
//     ({ KC.NGC, KC.NGV    }, { KC.NGP    }, [ KC.LGUI(KC.Z)                                      ]), // ^z
//     ({ KC.NGC, KC.NGV    }, { KC.NGH    }, [ KC.LGUI(KC.C)                                      ]), // ^c
//     ({ KC.NGC, KC.NGV    }, { KC.NGJ    }, [ KC.RIGHT                                           ]), // {→}
//     ({ KC.NGC, KC.NGV    }, { KC.NGK    }, [ KC.LSFT(KC.RIGHT)                                  ]), // +{→}
//     ({ KC.NGC, KC.NGV    }, { KC.NGL    }, [ KC.LSFT(KC.RIGHT)] * 5                              ), // +{→ 5}
//     ({ KC.NGC, KC.NGV    }, { KC.NGSCLN }, [ KC.LSFT(KC.RIGHT)] * 20                             ), // +{→ 20}
//     ({ KC.NGC, KC.NGV    }, { KC.NGN    }, [ KC.LSFT(KC.LCTL(KC.E))                             ]), // +{End}
//     ({ KC.NGC, KC.NGV    }, { KC.NGM    }, [ KC.LEFT                                            ]), // {←}
//     ({ KC.NGC, KC.NGV    }, { KC.NGCOMM }, [ KC.LSFT(KC.LEFT)                                   ]), // +{←}
//     ({ KC.NGC, KC.NGV    }, { KC.NGDOT  }, [ KC.LSFT(KC.LEFT)] * 5                               ), // +{← 5}
//     ({ KC.NGC, KC.NGV    }, { KC.NGSLSH }, [ KC.LSFT(KC.LEFT)] * 20                              ), // +{← 20}

];

function isSuperset(set, subset) {
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

function isSubset(set, superset) {
    return isSuperset(superset, set);
}

function isEqual(setA, setB) {
    return isSuperset(setA, setB) && isSubset(setA, setB);
}

function union(setA, setB) {
    const _union = new Set(setA);
    for (const elem of setB) {
        _union.add(elem);
    }
    return _union;
}

// かな変換の処理
function ngpress(kc) {
    console.log('key press   : ' + kc);
    if (!mask_keys.includes(kc)) return '';
    pressed_keys.add(kc);

    let i = nginput.length - 1;
    let j = -1;
    if (i >= 0 ) {
        j = nginput[i].length - 1;
    }

    // 後置シフトはしない
    if (kc == ' ') {
        nginput.push([kc]);
    // 前のキーとの同時押しの可能性があるなら前に足す
    // 同じキー連打を除外
    // V, H, EでVHがロールオーバーすると「こくて」=[[V,H], [E]]になる。「こりゃ」は[[V],[H,E]]。
    } else if (nginput.length > 0 && nginput[i][j] != kc && number_of_candidates(nginput[i].concat([kc])) > 0) {
        nginput[i].push(kc);
    // 前のキーと同時押しはない
    } else {
        nginput.push([kc]);
    }

    // 連続シフトする
    // がある　がる x (JIの組み合わせがあるからJがC/Oされる) strictモードを作る
    // あいあう　あいう x
    // ぎょあう　ぎょう x
    // どか どが x 先にFがc/oされてJが残される
    i = nginput.length - 1;
    for (const rs of [['d', 'f'], ['c', 'v'], ['j', 'k'], ['m', ','], [' '], ['f'], ['v'], ['j'], ['m']]) {
        const rskc = rs.concat(nginput[i]);
        // rskc.push(kc)
        // じょじょ よを先に押すと連続シフトしない x
        // Falseにすると、がる が　がある になる x
        if (rs.includes(kc) == false && isSubset(new Set(rs), pressed_keys) && number_of_matches(rskc) > 0) {
            nginput[i] = rskc;
            break;
        }
    }

    if (nginput.length > 1 || (nginput.length > 0 && number_of_candidates(nginput[0]) == 1)) {
        return ngtype(nginput.shift());
    }

    return '';
}


function ngrelease(kc) {
    console.log('key release : ' + kc);
    if (!mask_keys.includes(kc)) return '';
    pressed_keys.delete(kc);

    // 全部キーを離したらバッファを全部吐き出す
    if (pressed_keys.size == 0) {
        let r = [];
        while (nginput.length > 0) {
            r = r.concat(ngtype(nginput.shift()));
        }
        return r;
    }

    return '';
}

function ngtype(keys) {
    if (keys.length == 0) {
        return [];
    }
    console.log(nginput);

    let skc = new Set(keys);
    for (const k of ngdic) {
        if (isEqual(skc, union(k[0], k[1]))) {
            return k[2];
        }
    }
    // JIみたいにJIを含む同時押しはたくさんあるが、JIのみの同時押しがないとき
    // 最後の１キーを別に分けて変換する
    const kl = keys.shift();
    return ngtype(kl).concat(ngtype(keys));
}


function number_of_matches(keys) {
    if (keys.length == 0) {
        return 0;
    }

    let noc = 0;

    // skc = set(map(lambda x: KC.NGSFT if x == KC.NGSFT2 else x, keys))
    if (keys[0] == ' ' && keys.length == 1) {
        return 1;
    }
    if (keys[0] == ' ' && keys.length > 1) {
        const skc = new Set(keys.slice(1));
        for (const k of ngdic) {
            if (k[0].has(' ') && isEqual(skc, k[1])) {
                noc += 1;
                if (noc > 1) {
                    return noc;
                }
            }
        }
    }
    for (const rs of [['d', 'f'], ['c', 'v'], ['j', 'k'], ['m', ',']]) {
        if (keys.size == 3 && isEqual(new Set(keys.slice(0, 2)), new Set(rs))) {
            for (const k of ngdic) {
                if (isEqual(k[0], new Set(rs)) && isEqual(k[1], new Set(keys[2]))) {
                    noc = 1;
                    return noc;
                }
            }
        }
    }
    const skc = new Set(keys);
    for (const k of ngdic) {
        if (k[0].size == 0 && isEqual(skc, k[1])) {
            noc += 1;
            if (noc > 1) {
                return noc;
            }
        }
    }

    return noc
}

function number_of_candidates(keys) {
    if (keys.length == 0) {
        return 0;
    }

    let noc = 0;

    for (const rs of [[' '], ['d', 'f'], ['c', 'v'], ['j', 'k'], ['m', ',']]) {
        if (isEqual(new Set(keys), new Set(rs))) {
            return 2;
        }
    }

    if (keys[0] == ' ' && keys.length > 1) {
        const skc = new Set(keys.slice(1));
        for (const k of ngdic) {
            if (k[0].has(' ') && isSubset(skc, k[1])) {
                noc += 1;
                if (noc > 1) {
                    return noc;
                }
            }
        }
    }
    for (const rs of [['d', 'f'], ['c', 'v'], ['j', 'k'], ['m', ',']]) {
        if (keys.size == 3 && isEqual(new Set(keys.slice(0, 2)), new Set(rs))) {
            for (const k of ngdic) {
                if (isEqual(k[0], new Set(rs)) && isEqual(k[1], new Set(keys[2]))) {
                    noc = 1;
                    return noc;
                }
            }
        }
    }
    const skc = new Set(keys);
    for (const k of ngdic) {
        if (k[0].size == 0 && isSubset(skc, k[1])) {
            if (keys.length < k[1].length) {
                return 2;
            } else {
                noc += 1;
                if (noc > 1) {
                    return noc;
                }
            }
        }
    }

    return noc
}

export { ngpress, ngrelease }