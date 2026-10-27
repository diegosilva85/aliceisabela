// Original dance composition, not a transcription of Dance Mode.
#include "storage/project.h"
#include "audio/export.h"
#include "midi/midi.h"
#include <QCoreApplication>
#include <iostream>
using namespace cadencia;
int main(int argc,char**argv){QCoreApplication app(argc,argv);try{
 Composition c;c.title="Balões em Festa · verso, refrão, ponte e outro";c.bpm=120;c.bars=40;
 Track bass,chord,lead,bell,drums;
 bass.name="Baixo sintetizado";bass.program=38;bass.volume=75;
 chord.name="Teclas rítmicas";chord.program=4;chord.volume=60;chord.pan=-20;chord.polyphonic=true;
 lead.name="Sintetizador saltitante";lead.program=80;lead.volume=44;lead.pan=10;
 bell.name="Brilhos";bell.program=10;bell.volume=40;bell.pan=24;
 drums.name="Bateria de dança";drums.drums=true;drums.polyphonic=true;drums.volume=70;
 const int harmony[8][4]={{62,66,69,73},{59,62,66,69},{55,59,62,66},{57,61,64,69},{64,67,71,74},{55,59,62,66},{62,66,69,73},{57,61,64,67}};
 const int roots[8]={38,35,31,33,40,31,38,33};
 const int melody[8][8]={{78,0,81,78,76,0,74,76},{78,74,0,73,74,0,78,0},{79,0,78,74,71,0,74,78},{76,73,0,69,73,76,0,0},{79,78,76,0,74,76,79,0},{78,74,71,0,74,78,0,79},{81,0,78,76,74,0,78,81},{79,76,73,0,76,73,69,0}};
 EventId id=1;auto note=[&](Track&t,int p,Tick on,Tick dur,int vel){t.notes.push_back({id++,on,dur,pitchFromMidi(p),vel,{}});};
 for(int b=0;b<40;b++){Tick start=b*3840;int h=b%8;bool intro=b<4,chorus=(b>=12&&b<20)||(b>=28&&b<36),bridge=b>=20&&b<28,outro=b>=36;
  for(int k=0;k<4;k++){if(!bridge||k%2==0)note(drums,36,start+k*960,180,75);if(k%2)note(drums,39,start+k*960,180,61);}
  for(int k=0;k<8;k++)if(!intro||k%2)note(drums,k==7&&chorus?46:42,start+k*480,120,k%2?46:30);
  if((b+1)%8==0&&!outro)for(int k=0;k<4;k++)note(drums,38,start+2880+k*240,120,38+k*6);
  for(int k=0;k<(bridge?2:4);k++){int offset=bridge?k*1920:k*960;note(bass,roots[h]+(k==3?12:0),start+offset,bridge?1440:600,70);if(chorus)note(bass,roots[h]+12,start+offset+720,180,52);}
  for(int k=0;k<(bridge?1:4);k++)for(int j=0;j<4;j++)note(chord,harmony[h][j],start+(bridge?0:k*960+480),bridge?3360:300,bridge?37:54);
  if(!intro&&!outro)for(int k=0;k<8;k++)if(melody[h][k]&&(!bridge||k%3==0)&& (chorus||k<5))note(lead,melody[h][k]-(bridge?12:0),start+k*480,bridge?780:300,chorus?58:42);
  if(chorus||intro||outro)for(int k=0;k<4;k++)note(bell,harmony[h][k]+12,start+k*960+240,360,38);
 }
 c.tracks={bass,chord,lead,bell,drums};validate(c);saveProject(c,"music/keepup/baloes-em-festa.cadencia");midi::write("music/keepup/baloes-em-festa.mid",midi::encode(c,1,false));
 for(auto&t:c.tracks){auto notes=t.notes;for(int cycle=1;cycle<3;cycle++)for(auto n:notes){n.id=id++;n.onset+=cycle*40*3840;t.notes.push_back(n);}}c.bars=120;
 audio::Renderer loader;auto bank=loader.loadBank("/usr/share/cadencia/soundfonts/TimGM6mb.sf2",initialSoundFontId);
 auto r=audio::exportAudio(c,{bank},"/tmp/keepup-three-cycles.wav",{audio::ExportFormat::Wav,192});std::cout<<r.seconds<<" seconds, clipped="<<r.clippedSamples<<"\n";
 }catch(const std::exception&e){std::cerr<<e.what();return 1;}}
