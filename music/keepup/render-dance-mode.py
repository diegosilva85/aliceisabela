from pathlib import Path
import shlex, subprocess, sys
build=Path(sys.argv[1] if len(sys.argv)>1 else '/home/diego/Documents/ChatGPT/Criar musicas/build')
flags={}
for line in (build/'CMakeFiles/compose_rock.dir/flags.make').read_text().splitlines():
 if ' = ' in line:
  k,v=line.split(' = ',1);flags[k]=shlex.split(v)
subprocess.run(['c++',*flags['CXX_DEFINES'],*flags['CXX_INCLUDES'],*flags['CXX_FLAGS'],'-c','music/keepup/import-dance-mode.cpp','-o','/tmp/keepup-import.o'],check=True)
args=shlex.split((build/'CMakeFiles/compose_rock.dir/link.txt').read_text());args[args.index('-o')+1]='/tmp/keepup-import';args=[('/tmp/keepup-import.o' if a.endswith('.cpp.o') else a) for a in args]
subprocess.run(args,cwd=build,check=True)
subprocess.run(['/tmp/keepup-import'],check=True)
