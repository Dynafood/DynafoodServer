import sys

def mergefiles(id, en, fr, de, result):
    with open(id, "r") as idbase, open(en, "r") as enbase, open(fr, "r") as frbase, open(de, "r") as debase, open(result, "w") as resultBase:
        resultBase.write('\u007b"array":[')
        for idlines,enlines,frlines,delines in zip(idbase,enbase,frbase,debase):
            resultBase.write(f'\u007b\n\t"id":"{idlines[1:(len(idlines)-3)]}",\n\t"en":"{enlines.rstrip()}",\n\t"fr":"{frlines.rstrip()}",\n\t"ge":"{delines.rstrip()}"\n\u007d,\n')
        resultBase.write(']}')

mergefiles(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
