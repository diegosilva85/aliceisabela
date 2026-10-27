// Import the MIDI supplied by the user; preserve performed note timing and tempo.
#include "storage/project.h"
#include "audio/export.h"
#include "midi/midi.h"
#include <QCoreApplication>
#include <iostream>
using namespace cadencia;
int main(int argc,char**argv){QCoreApplication app(argc,argv);try{
 auto file=midi::read("music/keepup/dance-mode-user.mid");auto groups=midi::groups(file,false);
 std::cout<<"MIDI: "<<file.notes.size()<<" notes, "<<file.seconds()<<" seconds, "<<groups.size()<<" groups\n";
 auto result=midi::import(file,{},std::vector<midi::Mapping>(groups.size()));auto &c=result.music;c.title="Dance Mode · MIDI fornecido pelo usuário";
 for(const auto&w:result.warnings)std::cout<<"Import: "<<w.toStdString()<<"\n";
 for(const auto&t:c.tracks)std::cout<<t.name<<" program="<<t.program<<" drums="<<t.drums<<" notes="<<t.notes.size()<<"\n";
 validate(c);saveProject(c,"music/keepup/dance-mode.cadencia");
 // Repeat the 32-beat source three times to keep release tails in the middle cycle.
 EventId id=nextId(c);for(auto&t:c.tracks){auto notes=t.notes;for(int cycle=1;cycle<3;cycle++)for(auto n:notes){n.id=id++;n.onset+=cycle*32*ppq;if(n.performance)n.performance->onset=add(n.performance->onset,time(cycle*32));t.notes.push_back(n);}}c.bars=25;
 audio::Renderer loader;auto bank=loader.loadBank("/usr/share/cadencia/soundfonts/TimGM6mb.sf2",initialSoundFontId);
 auto r=audio::exportAudio(c,{bank},"/tmp/dance-mode-cadencia.wav",{audio::ExportFormat::Wav,192});std::cout<<"Export: "<<r.seconds<<" seconds, peak="<<r.peak<<", clipped="<<r.clippedSamples<<"\n";
 }catch(const std::exception&e){std::cerr<<e.what();return 1;}}
